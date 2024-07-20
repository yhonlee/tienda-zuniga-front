import { Component, inject } from '@angular/core';
import { untilDestroyed } from 'src/app/shared/operators';
import { GestionVentasService } from './services/gestion-ventas.service';
import { GestionVentasFiltrosService } from './services/gestion-ventas-filtros.service';
import { Observable, filter, tap } from 'rxjs';

@Component({
  selector: 'app-gestion-ventas',
  templateUrl: './gestion-ventas.component.html',
  styleUrls: ['./gestion-ventas.component.scss']
})
export class GestionVentasComponent {
  private untilDestroyed = untilDestroyed();

  private _gestionEmpleadosService = inject(GestionVentasService)
  private _refreshTable = inject(GestionVentasFiltrosService)

  public datosVentas$!: Observable<any>;

  ngOnInit(): void {
    this.obtenerEmpleados()
    this.onEventEmmiterPendientes();
  }

  obtenerEmpleados() {
    this.datosVentas$ = this._gestionEmpleadosService.gestListVentas();
  }

  public onEventEmmiterPendientes(): void {
    this._refreshTable.changePendientes$.pipe(
      filter(Boolean),
      tap(_ => this.obtenerEmpleados()),
      this.untilDestroyed(),
    ).subscribe();
  }
}
