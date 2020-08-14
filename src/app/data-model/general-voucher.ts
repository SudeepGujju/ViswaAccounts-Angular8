export interface GeneralVoucher {
    _id: string;
    No: string;
    date: string;
    vouchList: Voucher[];
    totDbAmt: string;
    totCrAmt: string;
    removedVoucherIds: string[];
}

interface Voucher {
    _id: string;
    code: string;
    desc: string;
    dbAmt: string;
    crAmt: string;
}
