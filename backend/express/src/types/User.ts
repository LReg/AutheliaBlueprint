export enum Role {
    NOROLE = 'noRole',
    ADMIN = 'admin',
    USER = 'user'
}
export interface User {
    email: string;
    name: string;
    preferredUsername: string;
    role: Role;
}