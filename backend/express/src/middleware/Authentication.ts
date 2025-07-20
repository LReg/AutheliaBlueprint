import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { Db } from 'mongodb';
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
                res.locals.user = {
                    email: user.email,
                    name: user.name,
                    preferredUsername: user.preferredUsername,
                    role: user.role
                };
                next();
            });
        })
        .catch(err => {
            console.error('Error while fetching userinfo:', err);
            res.status(500).send('Internal server error');
        });
};

const storeUserInDB = async (db: Db, user: User) => {

    try {
        await upsertUser(db, user);
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

    // map to camelCase
    response.data.preferredUsername = response.data.preferred_username;
    return response.data as User;
};