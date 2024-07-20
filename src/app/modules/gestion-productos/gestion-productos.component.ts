import { Component, inject } from '@angular/core';
import { untilDestroyed } from 'src/app/shared/operators';
import { GestionProductosFiltrosService } from './services/gestion-productos-filtros.service';
import { GestionProductosService } from './services/gestion-productos.service';
import { Observable, filter, tap } from 'rxjs';

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.scss']
})
export class GestionProductosComponent {
  private untilDestroyed = untilDestroyed();

  private _gestionEmpleadosService = inject(GestionProductosService)
  private _refreshTable = inject(GestionProductosFiltrosService)

  public datosProductos$!: Observable<any>;

  ngOnInit(): void {
    this.obtenerEmpleados()
    this.onEventEmmiterPendientes();
  }

  obtenerEmpleados() {
    this.datosProductos$ = this._gestionEmpleadosService.getListProducts();
  }

  public onEventEmmiterPendientes(): void {
    this._refreshTable.changePendientes$.pipe(
      filter(Boolean),
      tap(_ => this.obtenerEmpleados()),
      this.untilDestroyed(),
    ).subscribe();
  }
}
