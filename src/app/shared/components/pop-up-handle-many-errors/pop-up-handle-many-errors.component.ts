import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Icons } from '../../enums';


@Component({
  selector: 'app-pop-up-handle-many-errors',
  templateUrl: './pop-up-handle-many-errors.component.html',
  styleUrls: ['./pop-up-handle-many-errors.component.scss']
})
export class PopUpHandleManyErrorsComponent {

  ///assets/img/${Icons.boleta}.svg
  protected imgUrl: string = ``;
  protected errorsMessages: string[] = inject(MAT_DIALOG_DATA);

}
