import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealizarVentaBuscadorService {

  private changeFiltrosSelectedSubject = new Subject<boolean>();
  public changeFiltrosSelectedSubject$ = this.changeFiltrosSelectedSubject.asObservable();

  private changePendientes = new Subject<boolean>();
  public changePendientes$ = this.changePendientes.asObservable();

  public filtrosBandeja = signal<any | null>(null);
  public paginadorTablaPendientes = signal<{ s_page: number, s_per_page: number }>({ s_page: 1, s_per_page: 10 });

  public updateFiltros(filtros: any): void {
    this.filtrosBandeja.set(filtros);
    this.paginadorTablaPendientes.set({ s_page: 1, s_per_page: 10 });
  }

  public cleanAll() {
    this.filtrosBandeja.set('');
    this.paginadorTablaPendientes.set({ s_page: 1, s_per_page: 10 })
  }

  public tablaPendiente(s_page: number = 1, s_per_page: number = 10) {
    this.paginadorTablaPendientes.set({ s_page, s_per_page });
  }

  public eventEmmiterFiltros(state: boolean): void {
    this.changeFiltrosSelectedSubject.next(state);
  }

  public eventEmmiterPendiente(state: boolean): void {
    this.changePendientes.next(state);
  }

}
