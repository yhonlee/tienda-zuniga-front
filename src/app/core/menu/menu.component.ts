import { Component, inject } from '@angular/core';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private _token = inject(TokenService)
  public user: any;

  ngOnInit(): void {
    this.user = this._token.getUser
  }

  rol(): boolean {
    if (this.user.id_rol == 10) {
      return false
    } else if (this.user.id_rol == 20) {
      return true
    }
    return false
  }
}
