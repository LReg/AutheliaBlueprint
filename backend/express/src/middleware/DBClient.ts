import {NextFunction, Request, Response} from "express";
import {MongoClient} from "mongodb";

export const DBClientMiddlewareWrapper = (client: MongoClient) => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.locals.db = client.db('public');
        next();
    }
}
