package fiberGroups

import (
	"MarkroCounter/internal/handlers"
	"github.com/gofiber/fiber/v2"
)

func UserGroup(app *fiber.App) {
	group := app.Group("/user")
	group.Get("/current", handlers.CurrentUser)
	group.Get("/all", handlers.GetAllUsers)
}
