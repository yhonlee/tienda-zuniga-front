import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DepartmentsOfWork, JobPosition, ResponseGestionEmpleados, ResponseJobPosition } from '../interfaces';
import { GestionEmpleadosFiltrosService } from './gestion-empleados-filtros.service';

@Injectable()
export class GestionEmpleadosService {

  private _http = inject(HttpClient);
  private _refreshTable = inject(GestionEmpleadosFiltrosService)

  public getWorkDepartment(): Observable<DepartmentsOfWork[]> {
    return this._http.get<ResponseGestionEmpleados>('departments-of-work/get-all').pipe(map((response: ResponseGestionEmpleados) => { return response.data.departments_of_work }));
  }

  public getJobPosition(id_department: any): Observable<JobPosition[]> {
    return this._http.get<ResponseJobPosition>(`job-positions/get-by-department-id?id_work_department=${id_department}`).pipe(map((response: ResponseJobPosition) => { return response.data.job_positions }));
  }

  public createEmployee(body: any) {
    return this._http.post(`employees/create`, body)
  }

  public getStates(): Observable<any> {
    return this._http.get<any>('states/get-all').pipe(map((response) => { return response.data.states }));
  }

  public getListEmployees(): Observable<any> {
    const paginador = this._refreshTable.paginadorTablaPendientes()
    const filtros = this._refreshTable.filtrosBandeja()
    const ids = filtros?.estados != null ? filtros.estados.map((item: any) => item.id).join(',') : '';
    const nombre = filtros?.name ? `fullname=${filtros.name}&` : '';
    const estados = filtros?.estados ? `id_states=${ids}&` : ''
    return this._http.get<any>(`employees/get-employee-tray?${nombre}${estados}&page=${paginador.s_page || 1}&elements_per_page=${paginador.s_per_page || 10}`).pipe(map((response) => { return response.data }));
  }

  public getEmployees(id: number): Observable<any> {
    return this._http.get<any>(`employees/get-by-id/${id}`).pipe(map((response) => { return response }));
  }

  public refrestEmployees(id: number, body: any): Observable<any> {
    return this._http.put<any>(`employees/update/${id}`, body)
  }

  public inactiveEmployees(id: number): Observable<any> {
    return this._http.patch<any>(`employees/inactivate-by-id/${id}`, {})
  }

  public activeEmployees(id: number): Observable<any>{
    return this._http.patch<any>(`employees/activate-by-id/${id}`, {})
  }
}
