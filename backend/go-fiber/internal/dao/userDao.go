package dao

import (
	"MarkroCounter/internal/types"
	"context"
	"github.com/gofiber/fiber/v2/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func UpsertUser(col *mongo.Database, user *types.User) (*mongo.UpdateResult, error) {
	opt := options.Update().SetUpsert(true)

	res, err := col.Collection("user").UpdateOne(
		context.Background(),
		bson.M{"email": user.Email},
		bson.M{
			"$set": bson.M{
				"email":             user.Email,
				"name":              user.Name,
				"preferredUsername": user.PreferredUsername,
			},
		},
		opt,
	)

	if err != nil {
		return nil, err
	}
	return res, nil
}

func GetUserRole(col *mongo.Database, preferredUsername string) (types.Role, error) {
	var user types.User
	err := col.Collection("user").FindOne(
		context.Background(),
		bson.M{"preferredUsername": preferredUsername},
	).Decode(&user)

	if err != nil {
		return types.NoRole, err
	}
	return user.Role, nil
}

func SetUserRole(col *mongo.Database, preferredUsername string, role types.Role) (*mongo.UpdateResult, error) {
	res, err := col.Collection("user").UpdateOne(
		context.Background(),
		bson.M{"preferredUsername": preferredUsername},
		bson.M{
			"$set": bson.M{
				"role": role,
			},
		},
	)

	if err != nil {
		return nil, err
	}
	return res, nil
}

func GetAllUsers(col *mongo.Database) ([]types.User, error) {
	cursor, err := col.Collection("user").Find(context.Background(), bson.M{})

	if err != nil {
		log.Error("Error while fetching users: ", err)
		return nil, err
	}

	users := make([]types.User, 0)
	err = cursor.All(context.Background(), &users)
	if err != nil {
		log.Error("Error while decoding users: ", err)
		return nil, err
	}
	return users, nil
}
