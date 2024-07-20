import { Component, OnInit, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { GestionProductosService } from '../../services/gestion-productos.service';
import { GestionProductosFiltrosService } from '../../services/gestion-productos-filtros.service';
@Component({
  selector: 'app-creacion-productos-popup',
  templateUrl: './creacion-productos-popup.component.html',
  styleUrls: ['./creacion-productos-popup.component.scss']
})
export class CreacionProductosPopupComponent implements OnInit {

  public roles$!: Observable<any>;
  private _dialogModules = inject(CustomDialogService);
  private _formBuilder = inject(FormBuilder)
  private _gestionProductos = inject(GestionProductosService)
  private _refreshTable = inject(GestionProductosFiltrosService)
  public formEmpleado!: FormGroup;
  private dialogRef = inject(MatDialogRef<CreacionProductosPopupComponent>);
  public dataDialog = inject(MAT_DIALOG_DATA);

  public edit_mode: boolean = false;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.llenarData()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      name_product: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      id: [''],
    });
  }

  llenarData() {
    if (this.dataDialog) {
      this.edit_mode = true;
      const { name, description, price, stock, id } = this.dataDialog
      this.formEmpleado.get('name_product')?.patchValue(name)
      this.formEmpleado.get('description')?.patchValue(description)
      this.formEmpleado.get('price')?.patchValue(price)
      this.formEmpleado.get('stock')?.patchValue(stock)
      this.formEmpleado.get('id')?.patchValue(id)
    }
  }

  crearProducto() {
    const { name_product, description, price, stock } = this.formEmpleado.value

    const body = {
      name: name_product,
      description,
      price,
      stock
    }

    const params = {
      data: {
        icon: 'warning',
        title: this.edit_mode ? '¿Seguro que quieres actualizar el producto?' : '¿Seguro que quieres crear el producto?',
        buttonConfirmText: this.edit_mode ? 'Actualizar' : 'Crear',
        buttonConfirmColor: 'color-primary',
      }
    }

    this._dialogModules.openDialogConfirmation(params, (result) => {
      if (result) {
        if (!this.edit_mode) {
          this._gestionProductos.createProduct(body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se creó el producto con éxito.' }, (result) => {
                this.dialogRef.close()
                this._refreshTable.eventEmmiterPendiente(true)
              })
            } else {

            }
          })).subscribe()
        } else {
          const id = this.formEmpleado.get('id')?.value
          this._gestionProductos.refrestProduct(id, body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se actualizó el producto con éxito.' }, (result) => {
                this.dialogRef.close()
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
