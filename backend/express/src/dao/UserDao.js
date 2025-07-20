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
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertUser = upsertUser;
exports.getUserRole = getUserRole;
exports.setUserRole = setUserRole;
exports.getAllUsers = getAllUsers;
function upsertUser(db, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = { upsert: true };
        try {
            return yield db.collection('user').updateOne({ email: user.email }, {
                $set: {
                    email: user.email,
                    name: user.name,
                    preferredUsername: user.preferredUsername
                }
            }, options);
        }
        catch (err) {
            console.error('Error while upserting user:', err);
            throw err;
        }
    });
}
function getUserRole(db, preferredUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield db.collection('user').findOne({ preferredUsername });
            if (!user) {
                throw new Error('User not found');
            }
            if (!user.role) {
                throw new Error('User role not found');
            }
            return user.role;
        }
        catch (err) {
            console.error('Error while fetching user role:', err);
            throw err;
        }
    });
}
function setUserRole(db, preferredUsername, role) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield db.collection('user').updateOne({ preferredUsername }, {
                $set: { role }
            });
        }
        catch (err) {
            console.error('Error while setting user role:', err);
            throw err;
        }
    });
}
function getAllUsers(db) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usersCursor = yield db.collection('user').find({});
            return yield usersCursor.toArray();
        }
        catch (err) {
            console.error('Error while fetching all users:', err);
            throw err;
        }
    });
}
