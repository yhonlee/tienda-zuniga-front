import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GestionVentasFiltrosService } from './gestion-ventas-filtros.service';
@Injectable()
export class GestionVentasService {

  private _http = inject(HttpClient);
  private _refreshTable = inject(GestionVentasFiltrosService)

  public gestListVentas(): Observable<any> {
    const paginador = this._refreshTable.paginadorTablaPendientes()
    const filtros = this._refreshTable.filtrosBandeja()
    const nombre = filtros?.client != null ? `id_client=${filtros.client.id}&` : '';
    return this._http.get<any>(`sales/get-sale-tray?${nombre}page=${paginador.s_page || 1}&elements_per_page=${paginador.s_per_page || 10}`).pipe(map((response) => { return response.data }));
  }

  public getClient(nombre: string): Observable<any> {
    return this._http.get<any>(`clients/get-by-name?business_name=${nombre}`).pipe(map((response) => { return response.data.clients }));
  }

  public getDetailSales(id: number): Observable<any> {
    return this._http.get<any>(`sales-detail/get-by-sale-id/${id}`).pipe(map((response) => { return response }));
  }
}

