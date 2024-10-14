import {Router} from "express";
import {currentUser, handleGetAllUsers} from "../handler/User";

export const userRouter = Router();

userRouter.get('/current', currentUser)
userRouter.get('/all', handleGetAllUsers)