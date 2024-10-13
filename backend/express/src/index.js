"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = require("mongodb");
const DBClient_1 = require("./middleware/DBClient");
const Authentication_1 = require("./middleware/Authentication");
const UserRouter_1 = require("./router/UserRouter");
function createMongoClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("MONGO_URI environment variable not set.");
            process.exit(1);
        }
        const client = new mongodb_1.MongoClient(uri);
        try {
            yield client.connect();
            console.log("Successfully connected to MongoDB");
            return client;
        }
        catch (err) {
            console.error("Failed to connect to MongoDB:", err);
            process.exit(1);
        }
    });
}
function ensureMongoDbConnection(client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.db().admin().ping();
            console.log("MongoDB connection is active.");
        }
        catch (err) {
            console.error("Failed to ping MongoDB:", err);
            process.exit(1);
        }
    });
}
function registerRouters(app) {
    app.use('/user', UserRouter_1.userRouter);
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = 8080;
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, cors_1.default)());
        app.use((0, cookie_parser_1.default)());
        const client = yield createMongoClient();
        yield ensureMongoDbConnection(client);
        app.use((0, DBClient_1.DBClientMiddlewareWrapper)(client));
        app.use(Authentication_1.OIDCAuthMiddleware);
        registerRouters(app);
        app.listen(port, () => {
            console.log('Server started on port' + port);
        });
    });
}
start();
