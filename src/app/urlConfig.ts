// Calling API(BE) using configuration specified in proxy.config.json
export const APIPort = 8000;
export const APIBaseUrl = 'http://localhost';
// export const Url = APIBaseUrl + ':' + APIPort + '/api';
export const Url = '/api';

// export const Url = '/api';
export const RegisterUrl = Url + '/' + 'register';
export const LoginUrl = Url + '/' + 'auth/login';
export const RefreshTokenUrl = Url + '/' + 'auth/refresh';
export const LogoutUrl = Url + '/' + 'auth/logout';

export const userUrl = Url + '/' + 'user';
export const userPermUrl = Url + '/' + 'user/permissions';
export const reportFilesUrl = Url + '/' + 'reports/fileList';
export const reportFileDataUrl = Url + '/' + 'reports/fileData';

export const groupUrl = Url + '/group';
export const groupUploadUrl = groupUrl + '/upload';
export const groupCodeAvailUrl = groupUrl + '/codeAvailable';
export const groupDropdownUrl = groupUrl + '/dropdown';

export const accountUrl = Url + '/account';
export const accountCodeAvailUrl = accountUrl + '/codeAvailable';
export const accountDropdownUrl = accountUrl + '/dropdown';
export const accountUploadUrl = accountUrl + '/upload';

export const bankUrl = Url + '/' + 'bank';
export const bankSearchUrl = bankUrl + '/search';
export const bankNxtRecIDUrl = bankUrl + '/nextRecordID';

export const productUrl = Url + '/product';
export const productSearchUrl = productUrl + '/search';
export const productUserSearchUrl = productUrl + '/search/user';
export const productUploadUrl = productUrl + '/upload';

export const inventoryUrl = Url + '/inventory';
export const inventorySearchUrl = inventoryUrl + '/search';
export const inventoryNxtRecIDUrl = inventoryUrl + '/nextRecordID';
export const inventoryUploadUrl = inventoryUrl + '/upload';

export const genVouchUrl = Url + '/general-voucher';
export const genVouchNxtRecIDUrl = genVouchUrl + '/nextRecordID';
export const fileUploadUrl = Url + '/' + 'file/upload';

export const glPrepareUrl = Url + '/' + 'gl/prepare';
export const glAccountCopyUrl = Url + '/' + 'gl/accountCopy';