import {User} from "../types/User";
import {Db} from "mongodb";
import { Request, Response} from 'express';
import {getAllUsers} from "../dao/UserDao";

export const currentUser = async (req: Request, res: Response) => {
    const user = res.locals.user as User;
    res.json(user);
}

export const handleGetAllUsers = async (req: Request, res: Response) => {
    const db = res.locals.db as Db;
    try {
        const users = getAllUsers(db);
        res.json(users);
    } catch (err) {
        console.error('Error while fetching users:', err);
        res.status(500).send('Internal server error');
    }
}