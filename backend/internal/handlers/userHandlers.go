package handlers

import (
	"MarkroCounter/internal/dao"
	"MarkroCounter/internal/helper"
	"MarkroCounter/internal/types"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func CurrentUser(f *fiber.Ctx) error {
	claims := f.Locals("user").(*types.User)
	return f.JSON(*claims)
}

func GetAllUsers(f *fiber.Ctx) error {
	db := f.Locals("db").(*mongo.Database)
	users, err := dao.GetAllUsers(db)
	if err != nil {
		return helper.SendInternalServerError(f, err)
	}
	return f.JSON(users)
}
