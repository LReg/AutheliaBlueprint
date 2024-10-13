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
exports.OIDCAuthMiddleware = void 0;
const axios_1 = __importDefault(require("axios"));
const User_1 = require("../types/User");
const UserDao_1 = require("../dao/UserDao"); // Definiere deine User- und Role-Typen hier
const OIDCAuthMiddleware = (req, res, next) => {
    const userinfoEndpoint = `https://${process.env.AUTH_DOMAIN}/api/oidc/userinfo`;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send('Authorization header missing');
        return;
    }
    const token = authHeader.replace('Bearer ', '');
    if (token === authHeader) {
        res.status(401).send('Invalid Authorization header');
        return;
    }
    fetchUserInfo(userinfoEndpoint, token)
        .then(user => {
        if (!user) {
            res.status(401).send('Invalid token');
            return;
        }
        const db = res.locals.db;
        storeUserInDB(db, user).then(() => {
            res.locals.user = user;
            next();
        });
    })
        .catch(err => {
        next(err);
    });
};
exports.OIDCAuthMiddleware = OIDCAuthMiddleware;
const storeUserInDB = (db, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserDao_1.upsertUser)(db, user);
    let role = yield (0, UserDao_1.getUserRole)(db, user.preferredUsername);
    if (role === User_1.Role.NOROLE) {
        yield (0, UserDao_1.setUserRole)(db, user.preferredUsername, User_1.Role.USER);
        role = User_1.Role.USER;
    }
    user.role = role;
});
const fetchUserInfo = (userinfoEndpoint, token) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(userinfoEndpoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        console.error(`Failed to fetch userinfo: ${response.statusText}`);
        return null;
    }
    return response.data;
});
