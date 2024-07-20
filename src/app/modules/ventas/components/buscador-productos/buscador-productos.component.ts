import { Component, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, filter, finalize, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { RealizarVentaService } from '../../services/realizar-venta.service';
import { MatTableDataSource } from '@angular/material/table';
import { RealizarVentaBuscadorService } from '../../services/realizar-venta-buscador.service';

@Component({
  selector: 'app-buscador-productos',
  templateUrl: './buscador-productos.component.html',
  styleUrls: ['./buscador-productos.component.scss']
})
export class BuscadorProductosComponent {
  //Quien Aprueba
  @ViewChild('autoAprobador') autoCompleteAprobador!: MatAutocomplete;
  selectedValueAprobador!: string;

  protected filteredOptionsAprobador$ = new BehaviorSubject<any[] | null>(null);
  protected loadingAprobador$ = new BehaviorSubject<boolean>(false);
  protected toHighlightAprobador: string = '';


  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['product_name', 'quantity', 'uni_price', 'total_price', 'actions'];

  private _dialogModules = inject(CustomDialogService);
  private _formBuilder = inject(FormBuilder)
  private _gestionCliente = inject(RealizarVentaService)
  private _gestionVentaClient = inject(RealizarVentaBuscadorService)
  public formEmpleado!: FormGroup;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.onChangeFilterAprobador()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      client: [],
      client_document: []
    });
  }

  cleanFilters() {
    this.formEmpleado.reset();
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
    return value?.name;
  }

  private clientAprobador(name: string): Observable<any> {
    return this._gestionCliente.getProduct(name).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingAprobador$.next(false)));
  }

  onOptionSelectedAprobador(event: MatAutocompleteSelectedEvent) {
    this.formEmpleado.get('client')?.patchValue(event.option.value)

    const selectedValueAprobador = event.option.value;

    const nuevoElemento = {
      id_product: selectedValueAprobador.id,
      name_product: selectedValueAprobador.name,
      quantity: 1,
      uni_price: selectedValueAprobador.price,
      total_price: selectedValueAprobador.price
    };

    const exists = this.dataSource.data.some(
      (item) => item.id_product === nuevoElemento.id_product
    );

    if (exists) {

      const params = {
        data: {
          icon: 'warning',
          title: 'El producto que desea agregar, ya se encuentra en la lista',
          buttonConfirmText: 'Aceptar',
          buttonConfirmColor: 'color-primary',
          hideButtonCancel: true
        }
      };

      this._dialogModules.openDialogConfirmation(params, (result) => { })
    } else {
      this.dataSource.data = [...this.dataSource.data, nuevoElemento];
    }

    this.onClearAutocompleteAprobador()
  }

  ////Tabla
  onQuantityChange(element: any) {
    const quantity = Number(element.quantity);
    if (!isNaN(quantity)) {
      element.total_price = quantity * element.uni_price;
    }
  }

  getTotalCost() {
    const total = this.dataSource.data
      .map(t => t.total_price)
      .reduce((acc, value) => Number(acc) + Number(value), 0);
    return total.toFixed(2);
  }

  eliminarElemento(element: any) {
    const id = element.id_product;
    const index = this.dataSource.data.indexOf(element);

    if (index >= 0) {
      this.dataSource.data = this.dataSource.data.filter(item =>
        (item.id_product !== id || (item.offer_id === null && item !== element))
      );
    }
  }

  realizarVenta() {
    const userClient = this._gestionVentaClient.filtrosBandeja()
    const productos = this.dataSource.data.map(product => ({
      id_product: product.id_product,
      quantity: Number(product.quantity)
    }));

    if (productos.length > 0 && (userClient != null || userClient != '')) {
      const body = {
        id_client: userClient.client.id,
        products: productos
      }

      const params = {
        data: {
          icon: 'warning',
          title: '¿Seguro que quieres completar la venta?',
          buttonConfirmText: 'Completar',
          buttonConfirmColor: 'color-primary'
        }
      };

      this._dialogModules.openDialogConfirmation(params, (result) => {
        if (result) {

          this._gestionCliente.createVenta(body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se realizó la venta con éxito.' }, (result) => {
                this._gestionVentaClient.eventEmmiterPendiente(true)
                this.dataSource.data = []
              })
            }
          }
          )).subscribe()
        }
      })
    } else {
      const params = {
        data: {
          icon: 'warning',
          title: 'Seleccione al cliente o agregue productos a la venta',
          buttonConfirmText: 'Aceptar',
          buttonConfirmColor: 'color-primary',
          hideButtonCancel: true
        }
      };

      this._dialogModules.openDialogConfirmation(params, (result) => { })
    }
  }

  limpiarCompra() {
    const params = {
      data: {
        icon: 'warning',
        title: '¿Seguro que no deseas cancelar la venta?',
        buttonConfirmText: 'Cancelar',
        buttonConfirmColor: 'color-primary',
        buttonCancelText: 'Regresar'
      }
    };

    this._dialogModules.openDialogConfirmation(params, (result) => {
      if (result) {
        this._gestionVentaClient.eventEmmiterPendiente(true)
        this.dataSource.data = []
      }
    })
  }
}
