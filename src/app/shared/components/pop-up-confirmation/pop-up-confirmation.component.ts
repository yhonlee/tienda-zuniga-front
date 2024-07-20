import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Icons } from '../../enums';
import { IDataDialogConfirm } from '../../interfaces';

@Component({
  selector: 'app-pop-up-confirmation',
  templateUrl: './pop-up-confirmation.component.html',
  styleUrls: ['./pop-up-confirmation.component.scss']
})

export class PopUpConfirmationComponent implements OnInit {
  buttonCancelDefault:boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDataDialogConfirm) { }

  ngOnInit() {
    this.getIcon(Icons);
    this.buttonCancelDefault= (this.data.hideButtonCancel)?false:true;
  }

  private getIcon(icons: any): void {
    const icon = this.data.icon;
    if (icon) 
    this.data.icon = `/assets/icons/${icons[icon]}.svg`;
  }
}
