export enum DialogType {
    Alert = 1,
    Confirm = 2,
}

export enum AlertType {
    Success = 1,
    Warning = 2,
    Error = 3
}

export interface DialogConfig {
    title: string;
    message: string;
    dialogType: DialogType;
    alertType?: AlertType;
    cancelBtnLabel?: string;
    okBtnLabel?: string;
}
