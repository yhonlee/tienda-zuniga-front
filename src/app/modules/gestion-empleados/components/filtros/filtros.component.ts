import { Component, inject } from '@angular/core';
import { CreacionEmpleadosPopupComponent } from '../creacion-empleados-popup/creacion-empleados-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GestionEmpleadosFiltrosService } from '../../services/gestion-empleados-filtros.service';
import { GestionEmpleadosService } from '../../services/gestion-empleados.service';
@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent {

  public dialog = inject(MatDialog);
  private _formBuilder = inject(FormBuilder)
  private _refreshTable = inject(GestionEmpleadosFiltrosService)
  private _gestionEmpleadosService = inject(GestionEmpleadosService)
  public formEmpleado!: FormGroup;
  public states$!: Observable<any>;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.cargarEstados()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      name: [''],
      estados: [],
    });
  }

  cargarEstados() {
    this.states$ = this._gestionEmpleadosService.getStates()
  }

  onSubmit() {
    this._refreshTable.updateFiltros(this.formEmpleado.value)
    this._refreshTable.eventEmmiterPendiente(true)
  }

  cleanFilters(){
    this.formEmpleado.reset()
    this._refreshTable.updateFiltros(this.formEmpleado.value)
    this._refreshTable.eventEmmiterPendiente(true)
  }

  crearEmpleado(): void {
    const dialogRef = this.dialog.open(CreacionEmpleadosPopupComponent, {
      width: '35vw',
      maxHeight: '95vh',
      autoFocus: false,
      panelClass: "crear_empleados"
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe(popup => {
    })
  }
}
