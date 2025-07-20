import express, {Express} from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import {MongoClient} from "mongodb";
import {DBClientMiddlewareWrapper} from "./middleware/DBClient";
import {OIDCAuthMiddleware} from "./middleware/Authentication";
import {userRouter} from "./router/UserRouter";

async function createMongoClient() {
    const uri: string | undefined = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI environment variable not set.");
        process.exit(1);
    }
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Successfully connected to MongoDB");
        return client;
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}

async function ensureMongoDbConnection(client: MongoClient) {
    try {
        await client.db().admin().ping();
        console.log("MongoDB connection is active.");
    } catch (err) {
        console.error("Failed to ping MongoDB:", err);
        process.exit(1);
    }
}

function registerRouters(app: Express) {
    app.use('/user', userRouter);
}

async function start() {

    const port = 8080;
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(cookieParser());


    const client = await createMongoClient();
    await ensureMongoDbConnection(client);
    app.use(DBClientMiddlewareWrapper(client));

    app.use(OIDCAuthMiddleware  as express.RequestHandler);

    registerRouters(app);

    app.listen(port , () => {
        console.log('Server started on port' + port);
    });
}

start();