import {Router} from "express";
import {currentUser, getAllUsers} from "../handler/User";

export const userRouter = Router();

userRouter.get('/current', currentUser)
userRouter.get('/all', getAllUsers)