interface IDialogConfig {
    disableClose?: boolean;
    autoFocus?: boolean;
    panelClass?: string;
    enterAnimationDuration?: string;
    exitAnimationDuration?: string;
}

export interface IDataDialogConfirm {
    hideButtonCancel?:boolean;
    buttonCancelText?:string;
    buttonCancelColor?: string;
    buttonConfirmText?: string;
    buttonConfirmColor?: string;
    icon?: string;
    title: string;
    subtitle?: string;
}

const baseDialogConfig: IDialogConfig = {
    disableClose: false,
    autoFocus: false,
    enterAnimationDuration: '500ms',
    exitAnimationDuration: '500ms'
};

export const defaultDialogConfig: IDialogConfig = {
    ...baseDialogConfig,
    panelClass: 'custom-pop-result'
};

export const defaultDialogManyErrorsConfig: IDialogConfig = {
    ...baseDialogConfig,
    panelClass: 'custom-pop-up-handle-many-errors'
};

export const defaultDialogConfirmConfig: IDialogConfig = {
    ...baseDialogConfig,
    panelClass: 'custom-pop-up-confirmation'
};

export const defaultDialogConfirmInputConfig: IDialogConfig = {
    ...baseDialogConfig,
    panelClass: 'custom-pop-up-confirmation-input'
};

export interface IDataDialogConfirmInput extends IDataDialogConfirm{
    labelText:string;
    labelTextPlaceholder:string;
    limitMaxLength?:string;
}

export interface IDialogDefaultConfig extends Omit<IDialogConfig, 'panelClass'> {
    data: string;
}

export interface IDialogConfigConfirm extends Omit<IDialogConfig, 'panelClass'> {
    data: IDataDialogConfirm;
}

export interface IDialogConfigConfirmInput extends Omit<IDialogConfig, 'panelClass'> {
    data: IDataDialogConfirmInput;
}

export function createDialogConfig<T>(defaultConfig: T, dialogConfig: T): T {
    return Object.assign({}, defaultConfig, dialogConfig);
}

