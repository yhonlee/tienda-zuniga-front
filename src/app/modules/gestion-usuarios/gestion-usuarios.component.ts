import { Component, inject } from '@angular/core';
import { untilDestroyed } from 'src/app/shared/operators';
import { GestionUsuariosService } from './services/gestion-usuarios.service';
import { GestionUsuariosFiltrosService } from './services/gestion-usuarios-filtros.service';
import { Observable, filter, tap } from 'rxjs';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent {
  private untilDestroyed = untilDestroyed();

  private _gestionEmpleadosService = inject(GestionUsuariosService)
  private _refreshTable = inject(GestionUsuariosFiltrosService)

  public datosUsuarios$!: Observable<any>;

  ngOnInit(): void {
    this.obtenerEmpleados()
    this.onEventEmmiterPendientes();
  }

  obtenerEmpleados() {
    this.datosUsuarios$ = this._gestionEmpleadosService.getListEmployees();
  }

  public onEventEmmiterPendientes(): void {
    this._refreshTable.changePendientes$.pipe(
      filter(Boolean),
      tap(_ => this.obtenerEmpleados()),
      this.untilDestroyed(),
    ).subscribe();
  }
}
