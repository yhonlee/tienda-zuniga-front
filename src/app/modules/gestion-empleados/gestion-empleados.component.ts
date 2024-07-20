import { Component, OnInit, inject } from '@angular/core';
import { GestionEmpleadosService } from './services/gestion-empleados.service';
import { GestionEmpleadosFiltrosService } from './services/gestion-empleados-filtros.service';
import { Observable, filter, tap } from 'rxjs';
import { untilDestroyed } from 'src/app/shared/operators';

@Component({
  selector: 'app-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.scss']
})
export class GestionEmpleadosComponent implements OnInit {

  private untilDestroyed = untilDestroyed();

  private _gestionEmpleadosService = inject(GestionEmpleadosService)
  private _refreshTable = inject(GestionEmpleadosFiltrosService)

  public datosEmpleados$!: Observable<any>;

  ngOnInit(): void {
    this.obtenerEmpleados()
    this.onEventEmmiterPendientes();
  }

  obtenerEmpleados() {
    this.datosEmpleados$ = this._gestionEmpleadosService.getListEmployees();
  }

  public onEventEmmiterPendientes(): void {
    this._refreshTable.changePendientes$.pipe(
      filter(Boolean),
      tap(_ => this.obtenerEmpleados()),
      this.untilDestroyed(),
    ).subscribe();
  }
}
