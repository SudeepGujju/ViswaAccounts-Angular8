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
        case GroupType.Trading : return 'Trading';
        case GroupType.ProfitAndLoss : return 'Profit And Loss';
        case GroupType.BalanceSheet : return 'Balance Sheet';
    }
}
