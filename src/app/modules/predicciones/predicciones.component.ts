import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IChartApi, ISeriesApi, LineData, PriceScaleMode, createChart } from 'lightweight-charts';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, filter, finalize, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { PrediccionesService } from './services/predicciones.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { DropFileComponent } from './components/drop-file/drop-file.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-predicciones',
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.scss']
})
export class PrediccionesComponent {
  @ViewChild('container', { static: false }) container!: ElementRef<HTMLDivElement>;
  @ViewChild('dropFile', { static: false }) dropFile!: DropFileComponent;

  private _prediccionService = inject(PrediccionesService)
  private _dialogModules = inject(CustomDialogService);
  public formEmpleado!: FormGroup;
  private _formBuilder = inject(FormBuilder)

  public arrayData: any[] = []
  public arrayData2: any[] = []

  public arrayData3: any[] = []
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

      const product = this.formEmpleado.get('client')?.value
      const anio = this.formEmpleado.get('anio')?.value
      this._prediccionService.getGraphicPrediction(product.id, anio).pipe(tap((data: any) => {
        if (data.status == 1) {
          this.mostrarData = true;
          this.arrayData = data.data.format_prediction;
          this.arrayData2 = data.data.format_sales

          if (this.mostrarData) {

            setTimeout(() => {
              this.createChart();
              this.addLineSeries();
            }, 0);
          }
        }
      })).subscribe()
    } else {
      this.advertencia()
    }
  }


  private chart!: IChartApi;
  private lineSeriesOne!: ISeriesApi<'Line'>;
  private lineSeriesTwo!: ISeriesApi<'Line'>;

  private createChart(): void {

    if (!this.container) {
      setTimeout(() => this.createChart(), 0);
      return;
    }

    const chartOptions: any = {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
      },
    };

    this.chart = createChart(this.container.nativeElement, chartOptions);
    this.chart.timeScale().fitContent();

    this.chart.applyOptions({
      rightPriceScale: {
        autoScale: false,
        scaleMargins: {
          top: 0.009, // leave some space for the legend
          bottom: 0.009,
        },
      },
      crosshair: {
        // hide the horizontal crosshair line
        horzLine: {
          visible: true,
          labelVisible: true,
        },
        // hide the vertical crosshair label
        vertLine: {
          labelVisible: false,
        },
      },
      // hide the grid lines
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    });
  }


  private addLineSeries(): void {
    this.lineSeriesOne = this.chart.addLineSeries(
      {
        lastValueVisible: false,
        color: '#2962FF'
      });
    this.lineSeriesTwo = this.chart.addLineSeries({
      lastValueVisible: false,
      color: 'rgb(225, 87, 90)'
    });

    const lineSeriesOneData = this.arrayData;
    const lineSeriesTwoData = this.arrayData2;

    this.lineSeriesOne.setData(lineSeriesOneData);
    this.lineSeriesTwo.setData(lineSeriesTwoData);
  }

  detelePrediction() {

    const product = this.formEmpleado.get('client')?.value
    const anio = this.formEmpleado.get('anio')?.value

    const body = {
      id_product: product.id,
      year: anio.toString()
    }

    const params = {
      data: {
        icon: 'warning',
        title: '¿Seguro que quieres eliminar la predicción?',
        buttonConfirmText: 'Eliminar',
        buttonConfirmColor: 'color-primary'
      }
    };

    this._dialogModules.openDialogConfirmation(params, (result) => {
      if (result) {
        this._prediccionService.detetePrediction(body).pipe(tap(data => {
          if (data.status == 1) {
            this._dialogModules.openDialog({ data: 'Se eliminó la predicción con éxito.' }, (result) => {
              this.cleanFilters()
            })
          }
        })).subscribe()
      }
    })

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

  onTabChange(event: MatTabChangeEvent) {
    this.cleanFilters()
    this.dropFile.performAction();
  }
}


