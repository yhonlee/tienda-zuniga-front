import { Component } from '@angular/core';
import { IconsService } from './shared/services/icons.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'industrias_jc';

  constructor(
    private _iconsService: IconsService,
  ) {
    this._iconsService.registerIcons();
  }
}
