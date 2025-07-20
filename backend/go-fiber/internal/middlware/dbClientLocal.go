package middleware

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func DBClientLocalMiddleware(client *mongo.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("db", client.Database("public"))
		return c.Next()
	}
}
