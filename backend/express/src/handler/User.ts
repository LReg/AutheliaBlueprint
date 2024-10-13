import {User} from "../types/User";
import {Db} from "mongodb";
import { Request, Response} from 'express';

export const currentUser = async (req: Request, res: Response) => {
    const user = res.locals.user as User;
    res.json(user);
}

export const getAllUsers = async (req: Request, res: Response) => {
    const db = res.locals.db as Db;
    const users = await db.collection('user').find({}).toArray();
    res.json(users);
}