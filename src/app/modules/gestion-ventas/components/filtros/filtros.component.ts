import { Component, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GestionClientesFiltrosService } from 'src/app/modules/gestion-clientes/services/gestion-clientes-filtros.service';
import { GestionVentasFiltrosService } from '../../services/gestion-ventas-filtros.service';
import { GestionVentasService } from '../../services/gestion-ventas.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, filter, finalize, of, shareReplay, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent {
  public dialog = inject(MatDialog);

  private _formBuilder = inject(FormBuilder)
  private _refreshTable = inject(GestionVentasFiltrosService)
  private _gestionEmpleadosService = inject(GestionVentasService)
  public formEmpleado!: FormGroup;

   //Quien Aprueba
   @ViewChild('autoAprobador') autoCompleteAprobador!: MatAutocomplete;
   selectedValueAprobador!: string;
 
   protected filteredOptionsAprobador$ = new BehaviorSubject<any[] | null>(null);
   protected loadingAprobador$ = new BehaviorSubject<boolean>(false);
   protected toHighlightAprobador: string = '';


  ngOnInit(): void {
    this.initFormEmpleados()
    this.onChangeFilterAprobador()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      client: [],
    });
  }

  onSubmit() {
    this._refreshTable.updateFiltros(this.formEmpleado.value)
    this._refreshTable.eventEmmiterPendiente(true)
  }

  cleanFilters() {
    this.formEmpleado.reset()
    this._refreshTable.updateFiltros(this.formEmpleado.value)
    this._refreshTable.eventEmmiterPendiente(true)
    this.onClearAutocompleteAprobador()
  }

  //Aprobadores
  public get c(): { [key: string]: AbstractControl } {
    return this.formEmpleado.controls;
  }

  protected onFocusAutocompleteAprobador(): void {
    const { value } = this.formEmpleado.get('client')!;
    if (!value) this.filteredOptionsAprobador$.next(null);
  }

  public onChangeFilterAprobador(): void {
    this.formEmpleado.get('client')!.valueChanges.pipe(
      startWith<string>(''),
      filter(search => typeof search === 'string'),
      distinctUntilChanged(),
      debounceTime(500),
      filter((search) => search !== '' && search?.length > 0),
      tap((search) => {
        this.loadingAprobador$.next(true);
        this.toHighlightAprobador = search;
      }),
      switchMap(client => this.clientAprobador(client.toLowerCase())),
      tap((results) => {
        this.filteredOptionsAprobador$.next(results)
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    ).subscribe();
  }

  public onClearAutocompleteAprobador(): void {
    this.formEmpleado.get('client')?.setValue('');
    this.filteredOptionsAprobador$.next(null);
    this.toHighlightAprobador = '';
    this.autoCompleteAprobador.options.forEach(option => option.deselect());
  }

  public onDisplayFnAprobador(value: any): string {
    return value?.business_name;
  }

  private clientAprobador(name: string): Observable<any> {
    return this._gestionEmpleadosService.getClient(name).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingAprobador$.next(false)));
  }

  onOptionSelectedAprobador(event: MatAutocompleteSelectedEvent) {
    this.formEmpleado.get('client')?.patchValue(event.option.value)
  }
}
