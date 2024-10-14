"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const User_1 = require("../handler/User");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get('/current', User_1.currentUser);
exports.userRouter.get('/all', User_1.handleGetAllUsers);
