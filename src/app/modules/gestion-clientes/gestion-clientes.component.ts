import { Component, inject } from '@angular/core';
import { untilDestroyed } from 'src/app/shared/operators';
import { GestionClientesService } from './services/gestion-clientes.service';
import { GestionClientesFiltrosService } from './services/gestion-clientes-filtros.service';
import { Observable, filter, tap } from 'rxjs';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.scss']
})
export class GestionClientesComponent {
  private untilDestroyed = untilDestroyed();

  private _gestionEmpleadosService = inject(GestionClientesService)
  private _refreshTable = inject(GestionClientesFiltrosService)

  public datosClientes$!: Observable<any>;

  ngOnInit(): void {
    this.obtenerClientes()
    this.onEventEmmiterPendientes();
  }

  obtenerClientes() {
    this.datosClientes$ = this._gestionEmpleadosService.gestListClients();
  }

  public onEventEmmiterPendientes(): void {
    this._refreshTable.changePendientes$.pipe(
      filter(Boolean),
      tap(_ => this.obtenerClientes()),
      this.untilDestroyed(),
    ).subscribe();
  }
}
