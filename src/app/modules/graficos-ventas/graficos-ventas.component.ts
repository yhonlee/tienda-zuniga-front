import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, filter, finalize, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { GraficosVentasService } from './services/graficos-ventas.service';
import { AreaData, IChartApi, ISeriesApi, LineData, MouseEventParams, createChart } from 'lightweight-charts';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';

@Component({
  selector: 'app-graficos-ventas',
  templateUrl: './graficos-ventas.component.html',
  styleUrls: ['./graficos-ventas.component.scss']
})
export class GraficosVentasComponent implements OnInit, AfterViewInit {

  @ViewChild('container', { static: false }) container!: ElementRef<HTMLDivElement>;

  chart!: IChartApi;
  series!: ISeriesApi<'Area'>;
  private _dialogModules = inject(CustomDialogService)
  private _prediccionService = inject(GraficosVentasService)
  public formEmpleado!: FormGroup;
  private _formBuilder = inject(FormBuilder)

  public arrayData: any[] = []
  public infoAdicional: any;
  public productoData: any

  selectedYear: number | undefined;
  years: number[] = [];

  mostrarData: boolean = false;

  @ViewChild('autoAprobador') autoCompleteAprobador!: MatAutocomplete;
  selectedValueAprobador!: string;

  protected filteredOptionsAprobador$ = new BehaviorSubject<any[] | null>(null);
  protected loadingAprobador$ = new BehaviorSubject<boolean>(false);
  protected toHighlightAprobador: string = '';

  ngOnInit(): void {
    this.initFormEmpleados()
    this.onChangeFilterAprobador()
    this.cargarAnios()
  }

  ngAfterViewInit(): void { }

  private cargarAnios() {
    const endYear = new Date().getFullYear() + 50;
    const startYear = new Date().getFullYear() - 9; // Puedes ajustar el rango de años aquí
    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      client: ['', Validators.required],
      anio: ['', Validators.required]
    });
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
    this.mostrarData = false;
    this.infoAdicional = '';
    this.arrayData = [];
  }

  public onDisplayFnAprobador(value: any): string {
    return value?.name;
  }

  private clientAprobador(name: string): Observable<any> {
    return this._prediccionService.getProduct(name).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingAprobador$.next(false)));
  }

  onOptionSelectedAprobador(event: MatAutocompleteSelectedEvent) {
    this.cleanFilters();
    this.formEmpleado.get('client')?.patchValue(event.option.value)
    this.productoData = event.option.value
  }

  cleanFilters() {
    this.formEmpleado.reset();
    this.mostrarData = false;
    this.arrayData = []
    this.productoData = null
    this.onClearAutocompleteAprobador()
  }

  onSubmit() {

    if (this.formEmpleado.valid) {
      this.mostrarData = false;
      this.arrayData = []
      this.infoAdicional = ''

      const product = this.formEmpleado.get('client')?.value
      const anio = this.formEmpleado.get('anio')?.value


      this._prediccionService.getDetails(product.id, anio).pipe(tap((data: any) => {
        if (data.status == 1) {
          this.mostrarData = true;
          this.infoAdicional = data.data;

          this._prediccionService.getGraphic(product.id, anio).pipe(tap((data: any) => {
            if (data.status == 1) {
              this.mostrarData = true;
              this.arrayData = data.data.sales;
              if (this.mostrarData) {
                setTimeout(() => this.iniciarGraphics(), 0);
              }
            }
          })).subscribe()

        }
      })).subscribe()
    } else {
      this.advertencia()
    }

  }

  iniciarGraphics(): void {
    if (!this.container) {
      setTimeout(() => this.iniciarGraphics(), 0);
      return;
    }

    const chartOptions: any = {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
      },
    };

    console.log('price', chartOptions,)

    this.chart = createChart(this.container.nativeElement, chartOptions);

    this.chart.applyOptions({
      rightPriceScale: {
        scaleMargins: {
          top: 0.009,
          bottom: 0.009,
        },
      },
      crosshair: {
        horzLine: {
          visible: true,
          labelVisible: true,
        },
        vertLine: {
          labelVisible: false,

        },
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    });

    this.series = this.chart.addAreaSeries({
      topColor: 'rgba( 38, 166, 154, 0.28)',
      bottomColor: 'rgba( 38, 166, 154, 0.05)',
      lineColor: 'rgba( 38, 166, 154, 1)',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      lastValueVisible: false
    });

    this.series.setData(this.arrayData);
    this.chart.timeScale().fitContent();
  }

  advertencia() {
    const params = {
      data: {
        icon: 'warning',
        title: 'Selecciona el producto y fecha para continuar',
        buttonConfirmText: 'Aceptar',
        buttonConfirmColor: 'color-primary',
        hideButtonCancel: true
      }
    };

    this._dialogModules.openDialogConfirmation(params, (result) => {

    })
  }

  public formatNumber(value: any, appendPercentage: boolean = false): string {
    if (typeof value === 'string') {
      return value;
    }

    if (value === null || value === undefined || value === '') {
      return '0';
    }

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    if (typeof value === 'number' && isFinite(value)) {
      console.log('valor', value)
      const roundedValue = value.toFixed(2);
      const numberValue = parseFloat(roundedValue);

      const formattedValue = numberValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      return appendPercentage ? `${formattedValue}%` : formattedValue;
    }

    return '0';
  }
}
