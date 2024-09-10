package middleware

import (
	"MarkroCounter/internal/dao"
	"MarkroCounter/internal/helper"
	"MarkroCounter/internal/types"
	"context"
	"encoding/json"
	"errors"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
	"strings"
)

func OIDCAuthMiddleware() fiber.Handler {
	userinfoEndpoint := "https://" + helper.Ev("AUTH_DOMAIN") + "/api/oidc/userinfo"
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return helper.SendUnauthorized(c, errors.New("missing Authorization header"))
		}

		// Extract the token from the Authorization header
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader { // No "Bearer " prefix found
			return helper.SendUnauthorized(c, errors.New("invalid Authorization header"))
		}

		// Fetch userinfo from Authelia userinfo endpoint
		user, err := fetchUserInfo(userinfoEndpoint, token)
		if err != nil {
			return helper.SendUnauthorized(c, err)
		}

		err = storeUserInDB(c, user)
		if err != nil {
			return err
		}

		// Store relevant user information in Locals
		c.Locals("user", user)

		// Proceed to the next handler
		return c.Next()
	}
}

func storeUserInDB(c *fiber.Ctx, user *types.User) error {
	db := c.Locals("db").(*mongo.Database)

	_, err := dao.UpsertUser(db, user)
	if err != nil {
		return err
	}

	role, err := setRoleToUserIfNotSet(err, db, user)
	if err != nil {
		return err
	}
	user.Role = role

	return nil
}

func setRoleToUserIfNotSet(err error, db *mongo.Database, user *types.User) (types.Role, error) {
	role, err := dao.GetUserRole(db, user.PreferredUsername)
	if err != nil {
		return types.NoRole, err
	}

	if role == types.NoRole {
		_, err = dao.SetUserRole(db, user.PreferredUsername, types.RoleUser)
		if err != nil {
			return types.NoRole, err
		}
	}
	role = types.RoleUser
	return role, nil
}

// fetchUserInfo fetches the userinfo from Authelia using the provided token
func fetchUserInfo(userinfoEndpoint, token string) (*types.User, error) {
	req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, userinfoEndpoint, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("failed to fetch userinfo: " + resp.Status)
	}

	user := &types.User{}
	if err := json.NewDecoder(resp.Body).Decode(user); err != nil {
		return nil, err
	}

	return user, nil
}
