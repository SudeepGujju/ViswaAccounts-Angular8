import { Permissions } from './permissions';
import { Voucher } from './voucher';

export interface User {
    username: string;
    password: string;
    status: UserStatus;
    _id: string;
    permissions: Permissions;
    token: string;
    finYear: string;
    vouchersList?: Voucher[];
    accessToken: string;
    refreshToken: string;
}

export enum UserStatus {
    Active = 1,
    Inactive = 2
}
