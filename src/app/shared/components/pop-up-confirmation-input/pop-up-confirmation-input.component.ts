import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';


import { Icons } from '../../enums';
import { IDataDialogConfirmInput } from '../../interfaces';


@Component({
  selector: 'app-pop-up-confirmation-input',
  templateUrl: './pop-up-confirmation-input.component.html',
  styleUrls: ['./pop-up-confirmation-input.component.scss']
})
export class PopUpConfirmationInputComponent implements OnInit {

  public formTemplate!: FormGroup;

  get counter(): { [key: string]: AbstractControl } {
    return this.form['description'].value.length;
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formTemplate.controls;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDataDialogConfirmInput,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getIcon(Icons);
    this.initForm();
  }

  private initForm(): void {
    this.formTemplate = this.formBuilder.group({ description: ['', [Validators.required]] });
  }

  private getIcon(icons: any): void {
    const icon = this.data.icon;
    if (icon)
      this.data.icon = `/assets/icons/${icons[icon]}.svg`;
  }
}
