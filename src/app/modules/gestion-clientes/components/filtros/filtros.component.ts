import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { CreacionClientesPopupComponent } from '../creacion-clientes-popup/creacion-clientes-popup.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GestionClientesService } from '../../services/gestion-clientes.service';
import { GestionClientesFiltrosService } from '../../services/gestion-clientes-filtros.service';
import { GestionEmpleadosFiltrosService } from 'src/app/modules/gestion-empleados/services/gestion-empleados-filtros.service';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent {

  public dialog = inject(MatDialog);

  private _formBuilder = inject(FormBuilder)
  private _refreshTable = inject(GestionClientesFiltrosService)
  private _gestionEmpleadosService = inject(GestionClientesService)
  public formEmpleado!: FormGroup;

  public states$!: Observable<any>;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.cargarEstados()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      name: [],
      estados: [],
      documento: []
    });
  }

  cargarEstados() {
    this.states$ = this._gestionEmpleadosService.getStates()
  }

  onSubmit() {
    this._refreshTable.updateFiltros(this.formEmpleado.value)
    this._refreshTable.eventEmmiterPendiente(true)
  }

  cleanFilters() {
    this.formEmpleado.reset()
    this._refreshTable.updateFiltros(this.formEmpleado.value)
    this._refreshTable.eventEmmiterPendiente(true)
  }

  crearCliente(): void {
    const dialogRef = this.dialog.open(CreacionClientesPopupComponent, {
      width: '35vw',
      maxHeight: '95vh',
      autoFocus: false,
      panelClass: "crear_empleados"
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe(popup => {
    })
  }

}
