import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsService } from './services/icons.service';
import { LoaderComponent } from './components/loader/loader.component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { SafeHtmlPipeModule } from './pipes';
import { PopUpConfirmationComponent } from './components/pop-up-confirmation/pop-up-confirmation.component';
import { PopUpConfirmationInputComponent } from './components/pop-up-confirmation-input/pop-up-confirmation-input.component';
import { PopUpResultComponent } from './components/pop-up-result/pop-up-result.component';
import { PopUpHandleManyErrorsComponent } from './components/pop-up-handle-many-errors/pop-up-handle-many-errors.component';
import { NotifierComponent } from './components/notifier/notifier.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    LoaderComponent,
    //Dialogs
    PopUpConfirmationComponent,
    PopUpConfirmationInputComponent,
    PopUpResultComponent,
    PopUpHandleManyErrorsComponent,
    NotifierComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TextFieldModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    SafeHtmlPipeModule
  ],
  providers: [
    IconsService,
  ],
  exports: [
    // NotifierComponent,
    LoaderComponent,
    PopUpConfirmationComponent,
    PopUpConfirmationInputComponent,
    PopUpResultComponent,
    PopUpHandleManyErrorsComponent
  ]
})
export class SharedModule { }
