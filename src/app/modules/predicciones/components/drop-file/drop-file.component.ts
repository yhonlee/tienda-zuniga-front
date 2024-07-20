import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { PrediccionesService } from '../../services/predicciones.service';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, filter, finalize, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { IChartApi, ISeriesApi, createChart } from 'lightweight-charts';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-drop-file',
  templateUrl: './drop-file.component.html',
  styleUrls: ['./drop-file.component.scss']
})
export class DropFileComponent {

  private _prediccionService = inject(PrediccionesService)
  public files: NgxFileDropEntry[] = [];
  public filesUpdate: File[] = [];
  public isFileAllowed: boolean = true;
  public formEmpleado!: FormGroup;
  private _formBuilder = inject(FormBuilder)
  mostrarData: boolean = false;
  seleccione: boolean = false;

  public arrayData: any[] = []

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
      client: ['', Validators.required]
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
    this.seleccione = true;
  }

  cleanFilters() {
    this.formEmpleado.reset();
    this.filesUpdate = []
    this.files = []
    this.seleccione = false;
    this.mostrarData = false
  }

  public onSubmit(): void {
    this.mostrarData = false;
    this.arrayData = []
    this.filesUpdate = [];

    this.files.forEach((item: NgxFileDropEntry) => {
      const fileEntry = item.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.filesUpdate.push(file);
        // Cuando todos los archivos se hayan agregado, llama a guardarPrediccion
        if (this.filesUpdate.length === this.files.length) {

          const id = this.formEmpleado.get('client')?.value

          const params = {
            id,
            archivo: this.filesUpdate,
            relativePath: this.files[0].relativePath
          };

          this._prediccionService.guardarPrediccion(params).pipe(tap((data: any) => {
            if (data.status == 1) {
              const mappedData = data.data.predictions.map((item: any) => ({
                time: item.date_prediction,
                value: item.quantity
              }));
              this.mostrarData = true;
              this.arrayData = mappedData

              if (this.mostrarData) {
                setTimeout(() => {
                  this.iniciarGraphics()
                }, 0);
              }
            }
          })).subscribe()
        }
      })
    })
  }

  onDrop(files: NgxFileDropEntry[]): void {
    const fileExtension: string = files[0].fileEntry.name;
    if (!this.onIsFileAllowed(fileExtension)) return;
    this.files = files;
  }

  private onIsFileAllowed(fileName: string): boolean {
    this.isFileAllowed = true;
    const allowedFiles: string[] = ['.csv'];
    const regex: RegExp = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName)?.pop();
    if (extension && allowedFiles.includes(`.${extension}`)) {
      this.isFileAllowed = true;
    } else {
      this.isFileAllowed = false;
    }
    return this.isFileAllowed;
  }


  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  private chart!: IChartApi;
  private areaSeries!: ISeriesApi<'Area'>;

  iniciarGraphics(): void {
    if (!this.chartContainer) {
      setTimeout(() => this.iniciarGraphics(), 0);
      return;
    }

    const chartOptions: any = {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
      },
    };

    this.chart = createChart(this.chartContainer.nativeElement, chartOptions);

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

    this.areaSeries = this.chart.addAreaSeries({
      topColor: 'rgba( 38, 166, 154, 0.28)',
      bottomColor: 'rgba( 38, 166, 154, 0.05)',
      lineColor: 'rgba( 38, 166, 154, 1)',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      lastValueVisible: false
    });

    this.areaSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.009,
        bottom: 0.009,
      },
    });

    this.areaSeries.setData(this.arrayData);
    this.chart.timeScale().fitContent();
  }


  performAction() {
    this. cleanFilters()
  }
}