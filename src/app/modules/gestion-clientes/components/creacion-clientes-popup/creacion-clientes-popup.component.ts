import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GestionClientesService } from '../../services/gestion-clientes.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { tap } from 'rxjs';
import { GestionClientesFiltrosService } from '../../services/gestion-clientes-filtros.service';

@Component({
  selector: 'app-creacion-clientes-popup',
  templateUrl: './creacion-clientes-popup.component.html',
  styleUrls: ['./creacion-clientes-popup.component.scss']
})
export class CreacionClientesPopupComponent {
  private _dialogModules = inject(CustomDialogService);
  private _formBuilder = inject(FormBuilder)
  private _gestionCliente = inject(GestionClientesService)
  private _refreshTable = inject(GestionClientesFiltrosService)
  public formEmpleado!: FormGroup;
  private dialogRef = inject(MatDialogRef<CreacionClientesPopupComponent>);
  public dataDialog = inject(MAT_DIALOG_DATA);

  public edit_mode: boolean = false;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.llenarData()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      business_name: ['', Validators.required],
      identification_document: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      id: [''],
    });
  }

  llenarData() {
    if (this.dataDialog) {
      this.edit_mode = true;
      const { address, business_name, email, identification_document, phone, id } = this.dataDialog

      this.formEmpleado.get('business_name')?.patchValue(business_name)
      this.formEmpleado.get('identification_document')?.patchValue(identification_document)
      this.formEmpleado.get('address')?.patchValue(address)
      this.formEmpleado.get('phone')?.patchValue(phone)
      this.formEmpleado.get('email')?.patchValue(email)
      this.formEmpleado.get('id')?.patchValue(id)
    }
  }

  crearCliente() {
    const { business_name, identification_document, address, phone, email } = this.formEmpleado.value

    const body = {
      business_name,
      identification_document,
      address,
      phone, email
    }

    const params = {
      data: {
        icon: 'warning',
        title: this.edit_mode ? '¿Seguro que quieres actualizar al cliente?' : '¿Seguro que quieres crear al cliente?',
        buttonConfirmText: this.edit_mode ? 'Actualizar' : 'Crear',
        buttonConfirmColor: 'color-primary'
      }
    };

    this._dialogModules.openDialogConfirmation(params, (result) => {
      if (result) {
        if (!this.edit_mode) {
          this._gestionCliente.createClient(body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se creó el cliente con éxito.' }, (result) => {
                this.dialogRef.close(data)
                this._refreshTable.eventEmmiterPendiente(true)
              })
            } else {

            }
          })).subscribe()
        } else {
          const id = this.formEmpleado.get('id')?.value
          this._gestionCliente.refrestClient(id, body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se actualizó el cliente con éxito.' }, (result) => {
                this.dialogRef.close(data)
                this._refreshTable.eventEmmiterPendiente(true)
              })
            } else {

            }
          })).subscribe()
        }
      }
    })
  }
}
