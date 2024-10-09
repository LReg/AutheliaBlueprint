package helper

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

func errorHandler(c *fiber.Ctx, error error, code int) error {
	log.Error(error)
	return c.Status(code).JSON(fiber.Map{
		"error": error.Error(),
	})
}

func SendBadRequest(c *fiber.Ctx, error error) error {
	return errorHandler(c, error, fiber.StatusBadRequest)
}

func SendInternalServerError(c *fiber.Ctx, error error) error {
	return errorHandler(c, error, fiber.StatusInternalServerError)
}

func SendNotFound(c *fiber.Ctx, error error) error {
	return errorHandler(c, error, fiber.StatusNotFound)
}

func SendUnauthorized(c *fiber.Ctx, error error) error {
	return errorHandler(c, error, fiber.StatusUnauthorized)
}

func SendForbidden(c *fiber.Ctx, error error) error {
	return errorHandler(c, error, fiber.StatusForbidden)
}
