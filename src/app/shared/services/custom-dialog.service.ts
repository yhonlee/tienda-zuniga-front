import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IDialogConfigConfirm, IDialogConfigConfirmInput, IDialogDefaultConfig, createDialogConfig, defaultDialogConfig, defaultDialogConfirmConfig, defaultDialogConfirmInputConfig, defaultDialogManyErrorsConfig } from '../interfaces';
import { ComponentType } from '@angular/cdk/portal';
import { map, take } from 'rxjs';
import { PopUpResultComponent } from '../components/pop-up-result/pop-up-result.component';
import { PopUpConfirmationComponent } from '../components/pop-up-confirmation/pop-up-confirmation.component';
import { PopUpConfirmationInputComponent } from '../components/pop-up-confirmation-input/pop-up-confirmation-input.component';
import { PopUpHandleManyErrorsComponent } from '../components/pop-up-handle-many-errors/pop-up-handle-many-errors.component';

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {

  private dialog = inject(MatDialog)

  public openDialog(dialogConfig: IDialogDefaultConfig, callback?: (result: boolean) => void): void {

    const config = createDialogConfig(defaultDialogConfig, dialogConfig);
    this.openDialogGeneric(PopUpResultComponent, config, callback);

  }

  public openDialogConfirmation(dialogConfig: IDialogConfigConfirm, callback: (result: boolean) => void): void {
    const config = createDialogConfig(defaultDialogConfirmConfig, dialogConfig);
    this.openDialogGeneric(PopUpConfirmationComponent, config, callback);
  }

  public openDialogConfirmationInput(dialogConfig: IDialogConfigConfirmInput, callback: (result: boolean) => void): void {
    const config = createDialogConfig(defaultDialogConfirmInputConfig, dialogConfig);
    this.openDialogGeneric(PopUpConfirmationInputComponent, config, callback);
  }

  public openDialogHandleManyErrors(message: string[]): void {
    this.dialog.open(PopUpHandleManyErrorsComponent, {
      ...defaultDialogManyErrorsConfig,
      data: message
    });
  }

  private openDialogGeneric<T>(component: ComponentType<T>, config: MatDialogConfig, callback?: (state: boolean) => void): void {
    const dialogRef = this.dialog.open(component, config);
    if (callback)
      dialogRef.afterClosed().pipe(take(1), map((state) => callback(state))).subscribe();
  }
}
