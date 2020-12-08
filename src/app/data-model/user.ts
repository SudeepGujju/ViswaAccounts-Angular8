import { Permissions } from './permissions';

export interface User {
    username: string;
    password: string;
    status: UserStatus;
    _id: string;
    permissions: Permissions;
    token: string;
    finYear: string;
    accessToken: string;
    refreshToken: string;
}

export enum UserStatus {
    Active = 1,
    Inactive = 2
}
