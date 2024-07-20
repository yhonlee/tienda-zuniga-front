import { Component, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, filter, finalize, of, shareReplay, startWith, switchMap, take, tap } from 'rxjs';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { RealizarVentaService } from '../../services/realizar-venta.service';
import { RealizarVentaBuscadorService } from '../../services/realizar-venta-buscador.service';
import { CreacionClientesPopupComponent } from 'src/app/modules/gestion-clientes/components/creacion-clientes-popup/creacion-clientes-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { untilDestroyed } from 'src/app/shared/operators';

@Component({
  selector: 'app-buscador-cliente',
  templateUrl: './buscador-cliente.component.html',
  styleUrls: ['./buscador-cliente.component.scss']
})
export class BuscadorClienteComponent {

  public dialog = inject(MatDialog);
  private untilDestroyed = untilDestroyed();

  //Quien Aprueba
  @ViewChild('autoAprobador') autoCompleteAprobador!: MatAutocomplete;
  selectedValueAprobador!: string;

  protected filteredOptionsAprobador$ = new BehaviorSubject<any[] | null>(null);
  protected loadingAprobador$ = new BehaviorSubject<boolean>(false);
  protected toHighlightAprobador: string = '';

  //Quien Aprueba
  @ViewChild('auto') autoComplete!: MatAutocomplete;
  selectedValue!: string;

  protected filteredOptions$ = new BehaviorSubject<any[] | null>(null);
  protected loading$ = new BehaviorSubject<boolean>(false);
  protected toHighlight: string = '';


  private _dialogModules = inject(CustomDialogService);
  private _formBuilder = inject(FormBuilder)
  private _gestionCliente = inject(RealizarVentaService)
  private _refreshInfo = inject(RealizarVentaBuscadorService)
  public formEmpleado!: FormGroup;

  public edit_mode: boolean = false;
  public clientUser: any;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.onChangeFilterAprobador()
    this.onChangeFilter()
    this.onEventEmmiterPendientes()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      client: [],
      client_document: []
    });
  }

  onSubmit() {
    this._refreshInfo.updateFiltros(this.formEmpleado.value)
  }

  cleanFilters() {
    this.formEmpleado.reset();
    this.clientUser = '';
    this.edit_mode = false;
    this._refreshInfo.updateFiltros(this.formEmpleado.value)
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
  }

  public onDisplayFnAprobador(value: any): string {
    return value?.business_name;
  }

  private clientAprobador(name: string): Observable<any> {
    return this._gestionCliente.getClient(name).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingAprobador$.next(false)));
  }

  onOptionSelectedAprobador(event: MatAutocompleteSelectedEvent) {
    this.formEmpleado.get('client')?.patchValue(event.option.value)
    this.clientUser = this.formEmpleado.get('client')?.value
    this.edit_mode = true;
    this.onSubmit()
  }

  //Aprobadores
  public get a(): { [key: string]: AbstractControl } {
    return this.formEmpleado.controls;
  }

  protected onFocusAutocomplete(): void {
    const { value } = this.formEmpleado.get('client_document')!;
    if (!value) this.filteredOptions$.next(null);
  }

  public onChangeFilter(): void {
    this.formEmpleado.get('client_document')!.valueChanges.pipe(
      startWith<string>(''),
      filter(search => typeof search === 'string'),
      distinctUntilChanged(),
      debounceTime(500),
      filter((search) => search !== '' && search?.length > 0),
      tap((search) => {
        this.loading$.next(true);
        this.toHighlight = search;
      }),
      switchMap(client => this.client(client.toLowerCase())),
      tap((results) => {
        this.filteredOptions$.next(results)
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    ).subscribe();
  }

  public onClearAutocomplete(): void {
    this.formEmpleado.get('client_document')?.setValue('');
    this.filteredOptions$.next(null);
    this.toHighlight = '';
  }

  public onDisplayFn(value: any): string {
    return value?.business_name;
  }

  private client(name: string): Observable<any> {
    return this._gestionCliente.getClientByDocument(name).pipe(
      catchError(() => of([])),
      finalize(() => this.loading$.next(false)));
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.formEmpleado.get('client')?.patchValue(event.option.value)

    this.clientUser = this.formEmpleado.get('client')?.value
    this.edit_mode = true;
    this.onSubmit()
  }

  crearCliente(): void {
    const dialogRef = this.dialog.open(CreacionClientesPopupComponent, {
      width: '35vw',
      maxHeight: '95vh',
      autoFocus: false,
      panelClass: "crear_empleados"
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe(popup => {
      if (popup.status == 1) {
        this.clientUser = popup.data.client;
        this.formEmpleado.get('client')?.patchValue(this.clientUser)
        this.edit_mode = true;
        this.onSubmit()
      }
    })
  }

  public onEventEmmiterPendientes(): void {
    this._refreshInfo.changePendientes$.pipe(
      filter(Boolean),
      tap(_ => this.limpiar()),
      this.untilDestroyed(),
    ).subscribe();
  }

  limpiar() {
    this.formEmpleado.reset()
    this._refreshInfo.cleanAll()
    this.edit_mode = false;
    this.onClearAutocompleteAprobador()
    this.onClearAutocomplete()
  }

}
