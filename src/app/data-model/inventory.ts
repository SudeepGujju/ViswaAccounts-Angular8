export interface Inventory {
  _id: string;
  invntryType: number;
  invntryName?: 'Sale'| 'Purchase' | 'Sale Return' | 'Purchase Return' | 'Other';
  SL: string;
  date: string;
  fromCode: string;
  toCode: string;
  cashRcredit: number;
  CashRCreditName: 'Cash' | 'Credit';
  invcNo: string;
  invcDate: string;
  fiveAmt: string;
  fivePerAmt: string;
  twelveAmt: string;
  twelvePerAmt: string;
  eighteenAmt: string;
  eighteenPerAmt: string;
  twntyEightAmt: string;
  twntyEightPerAmt: string;
  zeroAmt: string;
  totalAmt: string;
  totalPerAmt: string;
  roundingAmt: string;
  totalInvcAmt: string;
}

export enum InventoryType {
  Sale = 1,
  Purchase = 2,
  SaleReturn = 3,
  PurchaseReturn = 4,
  Other = 5
}

export enum CashRCreditType {
  Cash = 1,
  Credit = 2
}

export function InventorTypeMapping(invntryType) {

  switch (invntryType) {
      case 1 : return 'Sale';
      case 2 : return 'Purchase';
      case 3 : return 'Sale Return';
      case 4 : return 'Purchase Return';
      case 5 : return 'Other';
  }
}

export function CashRCreditTypeMapping(cashRcredit) {

  switch (cashRcredit) {
      case 1 : return 'Cash';
      case 2 : return 'Credit';
  }

}

export function InventoryTypeCode(inventoryType: InventoryType) {

  switch (inventoryType) {
    case InventoryType.Sale : return '1004';
    case InventoryType.Purchase : return '1002';
    case InventoryType.SaleReturn : return '1006';
    case InventoryType.PurchaseReturn : return '1007';
    default : return '';
  }
}
