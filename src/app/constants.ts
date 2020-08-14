import { productUploadUrl, groupUploadUrl, accountUploadUrl, inventoryUploadUrl } from "./urlConfig";

export enum MODULE_TYPE{
  ACCOUNT= 1,
  BANK= 2,
  GROUP= 3,
  REPORT= 4,
  PRODUCT= 5,
  USER= 6,
  GL= 7,
  INVENTORY= 8,
  GENERAL_VOUCHER= 9,
  FILE= 10
};

export interface UploadConfig{
    moduleName: string;
    title: string;
    url: string;
    confirmation: boolean;
    confirmationMessage?: string;
}

export function getUploadConfig(module: number): UploadConfig {

  switch (module) {
    case MODULE_TYPE.ACCOUNT: return {moduleName: 'Account', title: "Create Account", url: accountUploadUrl, confirmation: false};
    case MODULE_TYPE.GROUP: return {moduleName: 'Group', title: "Create Group", url: groupUploadUrl, confirmation: false};
    case MODULE_TYPE.INVENTORY: return {moduleName: 'Inventory', title: "Create Inventory", url: inventoryUploadUrl, confirmation: false};
    case MODULE_TYPE.PRODUCT: return {moduleName: 'Product', title: "Product", url: productUploadUrl, confirmation: true, confirmationMessage: 'Uploading new file removes previous records'};
  }
}
