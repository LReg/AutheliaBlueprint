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

		// Store relevant user information in Locals
		c.Locals("user", user)

		err = storeUserInDB(c, user)
		if err != nil {
			return helper.SendInternalServerError(c, err)
		}

		// Proceed to the next handler
		return c.Next()
	}
}

func storeUserInDB(c *fiber.Ctx, user *types.User) error {
	userCol := c.Locals("db").(*mongo.Database).Collection("users")

	_, err := dao.UpsertUser(userCol, user)
	if err != nil {
		return err
	}
	return nil
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
