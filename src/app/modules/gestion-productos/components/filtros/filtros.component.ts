import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { CreacionProductosPopupComponent } from '../creacion-productos-popup/creacion-productos-popup.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GestionProductosService } from '../../services/gestion-productos.service';
import { GestionProductosFiltrosService } from '../../services/gestion-productos-filtros.service';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent {
  public dialog = inject(MatDialog);

  private _formBuilder = inject(FormBuilder)
  private _refreshTable = inject(GestionProductosFiltrosService)
  private _gestionEmpleadosService = inject(GestionProductosService)
  public formProductos!: FormGroup;

  public states$!: Observable<any>;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.cargarEstados()
  }

  private initFormEmpleados(): void {
    this.formProductos = this._formBuilder.group({
      name: [''],
      estados: [],
    });
  }

  cargarEstados() {
    this.states$ = this._gestionEmpleadosService.getStates()
  }

  onSubmit() {
    this._refreshTable.updateFiltros(this.formProductos.value)
    this._refreshTable.eventEmmiterPendiente(true)
  }

  cleanFilters() {
    this.formProductos.reset()
    this._refreshTable.updateFiltros(this.formProductos.value)
    this._refreshTable.eventEmmiterPendiente(true)
  }


  crearProductos(): void {
    const dialogRef = this.dialog.open(CreacionProductosPopupComponent, {
      width: '35vw',
      maxHeight: '95vh',
      autoFocus: false,
      panelClass: "crear_empleados"
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe(popup => {
    })
  }
}
