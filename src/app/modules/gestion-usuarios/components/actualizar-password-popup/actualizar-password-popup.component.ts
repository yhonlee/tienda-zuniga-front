import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GestionUsuariosService } from '../../services/gestion-usuarios.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'app-actualizar-password-popup',
  templateUrl: './actualizar-password-popup.component.html',
  styleUrls: ['./actualizar-password-popup.component.scss']
})
export class ActualizarPasswordPopupComponent implements OnInit {

  private _dialogModules = inject(CustomDialogService);
  private _formBuilder = inject(FormBuilder)
  private _gestionUsuarios = inject(GestionUsuariosService)
  public formEmpleado!: FormGroup;
  private dialogRef = inject(MatDialogRef<ActualizarPasswordPopupComponent>);
  public dataDialog = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.initFormEmpleados()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      password: ['', Validators.required],
      id: []
    });
  }

  actualizarContrasena() {
    const { password } = this.formEmpleado.value

    const body = {
      new_password: password
    }

    const params = {
      data: {
        icon: 'warning',
        title: '¿Seguro que quieres actualizar la contraseña?',
        buttonConfirmText: 'Actualizar',
        buttonConfirmColor: 'color-primary',
      }
    }

    this._dialogModules.openDialogConfirmation(params, (result) => {
      if (result) {
        const id = this.dataDialog
        this._gestionUsuarios.updatePasswordAdmin(id, body).pipe(tap((data: any) => {
          if (data.status == 1) {
            this._dialogModules.openDialog({ data: 'Se actualizó la contraseña con éxito.' }, (result) => {
              this.dialogRef.close()
            })
          } else {

          }
        })).subscribe()
      }
    })
  }
}
