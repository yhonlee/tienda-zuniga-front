import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreacionUsuarioPopupComponent } from '../creacion-usuarios-popup/creacion-usuario-popup.component';
import { Observable, take } from 'rxjs';
import { GestionUsuariosFiltrosService } from '../../services/gestion-usuarios-filtros.service';
import { GestionUsuariosService } from '../../services/gestion-usuarios.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent {
  public dialog = inject(MatDialog);

  private _formBuilder = inject(FormBuilder)
  private _refreshTable = inject(GestionUsuariosFiltrosService)
  private _gestionEmpleadosService = inject(GestionUsuariosService)
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
      username: [''],
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
    const dialogRef = this.dialog.open(CreacionUsuarioPopupComponent, {
      width: '35vw',
      maxHeight: '95vh',
      autoFocus: false,
      panelClass: "crear_empleados"
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe(popup => {
    })
  }
}
