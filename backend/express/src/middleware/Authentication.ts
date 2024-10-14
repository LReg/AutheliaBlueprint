import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { MongoClient, Db } from 'mongodb';
import { User, Role } from '../types/User';
import {getUserRole, setUserRole, upsertUser} from "../dao/UserDao"; // Definiere deine User- und Role-Typen hier

export const OIDCAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
            const db = res.locals.db as Db;
            storeUserInDB(db, user).then(() => {
                res.locals.user = user;
                next();
            });
        })
        .catch(err => {
            next(err);
        });
};

const storeUserInDB = async (db: Db, user: User) => {
    await upsertUser(db, user);

    try {
        let role = await getUserRole(db, user.preferredUsername);
        if (role === Role.NOROLE) {
            await setUserRole(db, user.preferredUsername, Role.USER);
            role = Role.USER;
        }

        user.role = role;
    } catch (err) {
        console.error('Error while storing user in DB:', err);
    }
};

const fetchUserInfo = async (userinfoEndpoint: string, token: string): Promise<User | null> => {
    const response = await axios.get(userinfoEndpoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status !== 200) {
        console.error(`Failed to fetch userinfo: ${response.statusText}`);
        return null;
    }

    return response.data as User;
};