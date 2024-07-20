import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { ActualizarPasswordPopupComponent } from './components/actualizar-password-popup/actualizar-password-popup.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  private _router = inject(Router);
  private _token = inject(TokenService)
  public dialog = inject(MatDialog);
  public user: any;

  ngOnInit(): void {
    this.user = this._token.getUser
  }

  logout() {
    localStorage.clear();
    this._router.navigateByUrl('/');
  }

  openChangePassword() {
    this.dialog.open(ActualizarPasswordPopupComponent, {
      width: '35vw',
      maxHeight: '95vh',
      autoFocus: false,
      panelClass: "crear_empleados",
      data: this.user.id
    })
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
