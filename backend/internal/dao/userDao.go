package dao

import (
	"MarkroCounter/internal/types"
	"context"
	"github.com/gofiber/fiber/v2/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func UpsertUser(col *mongo.Collection, user *types.User) (*mongo.UpdateResult, error) {
	opt := options.Update().SetUpsert(true)

	res, err := col.UpdateOne(
		context.Background(),
		bson.M{"email": user.Email},
		bson.M{
			"$set": bson.M{
				"email":          user.Email,
				"name":           user.Name,
				"uniqueUserName": user.UniqueUserName,
			},
		},
		opt,
	)

	if err != nil {
		return nil, err
	}
	return res, nil
}

func SetUserRole(col *mongo.Collection, uniqueUserName string, role types.Role) (*mongo.UpdateResult, error) {
	res, err := col.UpdateOne(
		context.Background(),
		bson.M{"uniqueUserName": uniqueUserName},
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

func GetAllUsers(col *mongo.Collection) ([]types.User, error) {
	cursor, err := col.Find(context.Background(), bson.M{})

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
