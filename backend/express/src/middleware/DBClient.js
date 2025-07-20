"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClientMiddlewareWrapper = void 0;
const DBClientMiddlewareWrapper = (client) => {
    return (req, res, next) => {
        res.locals.db = client.db('public');
        next();
    };
};
exports.DBClientMiddlewareWrapper = DBClientMiddlewareWrapper;
