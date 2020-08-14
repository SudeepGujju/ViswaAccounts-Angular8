export interface Group {
    _id: string;
    code: string;
    name: string;
    grpType: GroupType;
    groupName?: 'Trading'| 'Profit And Loss' | 'Balance Sheet';
}

export enum GroupType {
    Trading = 1,
    ProfitAndLoss = 2,
    BalanceSheet = 3
}

export function GroupTypeMapping(grpType) {

    switch (grpType) {
        case 1 : return 'Trading';
        case 2 : return 'Profit And Loss';
        case 3 : return 'Balance Sheet';
    }
}
