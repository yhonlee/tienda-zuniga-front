import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GestionClientesFiltrosService } from './gestion-clientes-filtros.service';

@Injectable()
export class GestionClientesService {

  private _http = inject(HttpClient);
  private _refreshTable = inject(GestionClientesFiltrosService)

  public createClient(body: any) {
    return this._http.post(`clients/create`, body)
  }

  public getStates(): Observable<any> {
    return this._http.get<any>('states/get-all').pipe(map((response) => { return response.data.states }));
  }

  public gestListClients(): Observable<any> {
    const paginador = this._refreshTable.paginadorTablaPendientes()
    const filtros = this._refreshTable.filtrosBandeja()
    const ids = filtros?.estados != null ? filtros.estados.map((item: any) => item.id).join(',') : '';
    const documento = filtros?.documento != null ? `identification_document=${filtros.documento}&` : '';
    const nombre = filtros?.name ? `business_name=${filtros.name}&` : '';
    const estados = filtros?.estados ? `id_states=${ids}&` : '';
    return this._http.get<any>(`clients/get-client-tray?${documento}${nombre}${estados}&page=${paginador.s_page || 1}&elements_per_page=${paginador.s_per_page || 10}`).pipe(map((response) => { return response.data }));
  }

  public getClient(id: number): Observable<any> {
    return this._http.get<any>(`clients/get-by-id/${id}`).pipe(map((response) => { return response }));
  }

  public refrestClient(id: number, body: any): Observable<any> {
    return this._http.put<any>(`clients/update/${id}`, body)
  }

  public inactiveClient(id: number): Observable<any> {
    return this._http.patch<any>(`clients/inactivate-by-id/${id}`, {})
  }

  public activeClient(id: number): Observable<any>{
    return this._http.patch<any>(`clients/activate-by-id/${id}`, {})
  }

  /*   public getWorkDepartment(): Observable<DepartmentsOfWork[]> {
      return this._http.get<ResponseGestionEmpleados>('departments-of-work/get-all').pipe(map((response: ResponseGestionEmpleados) => { return response.data.departments_of_work }));
    }
  
    public getJobPosition(id_department: any): Observable<JobPosition[]> {
      return this._http.get<ResponseJobPosition>(`job-positions/get-by-department-id?id_work_department=${id_department}`).pipe(map((response: ResponseJobPosition) => { return response.data.job_positions }));
    }
  
    public createEmployee(body: any) {
      return this._http.post(`employees/create`, body) */
  /*  } */
}
