package main

import (
	"MarkroCounter/internal/fiberGroups"
	"MarkroCounter/internal/helper"
	middleware "MarkroCounter/internal/middlware"
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	client, err := createMongoClient()
	if err != nil {
		log.Fatalf("Failed to create MongoDB client: %v", err)
		panic(err)
	}
	ensureMongoDbConnection(client)

	app := createFiberApp()
	registerMiddleware(app, client)
	registerFiberGroups(app)

	err = app.Listen(":8080")
	if err != nil {
		log.Fatal(err)
	}
}

func registerMiddleware(app *fiber.App, client *mongo.Client) {
	app.Use(cors.New())
	app.Use(logger.New())
	app.Use(middleware.DBClientLocalMiddleware(client))
	app.Use(middleware.OIDCAuthMiddleware())
}

func registerFiberGroups(app *fiber.App) {
	fiberGroups.UserGroup(app)
}

func createMongoClient() (*mongo.Client, error) {
	return mongo.Connect(
		context.Background(),
		options.Client().ApplyURI(helper.Ev("MONGO_URI")))
}

func createFiberApp() *fiber.App {
	log.SetLevel(log.LevelDebug)
	return fiber.New(fiber.Config{
		Prefork:           false,
		CaseSensitive:     false,
		StrictRouting:     false,
		ServerHeader:      "Fiber",
		AppName:           "FiberTest",
		EnablePrintRoutes: true,
	})
}

func ensureMongoDbConnection(client *mongo.Client) {
	log.Debug("Pinging MongoDB...")
	err := client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	log.Debug("Successfully connected to MongoDB")
}
