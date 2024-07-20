import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraficosVentasRoutingModule } from './graficos-ventas-routing.module';
import { GraficosVentasComponent } from './graficos-ventas.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirstLetterUppercasePipeModule, HighlightPipeModule, SortByPipeModule } from 'src/app/shared/pipes';
import { GraficosVentasService } from './services/graficos-ventas.service';
import { GlobalProviders } from 'src/app/shared/interceptors/global.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from 'src/app/shared/language/spanish-paginator-intl';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


@NgModule({
  declarations: [
    GraficosVentasComponent
  ],
  imports: [
    CommonModule,
    GraficosVentasRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    SortByPipeModule,
    FirstLetterUppercasePipeModule,
    HighlightPipeModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [
      GraficosVentasService,
      GlobalProviders,
      { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
  ],
})
export class GraficosVentasModule { }
