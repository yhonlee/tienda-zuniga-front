import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrediccionesRoutingModule } from './predicciones-routing.module';
import { DropFileComponent } from './components/drop-file/drop-file.component';
import { PrediccionesComponent } from './predicciones.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PrediccionesService } from './services/predicciones.service';
import { GlobalProviders } from 'src/app/shared/interceptors/global.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from 'src/app/shared/language/spanish-paginator-intl';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SortByPipeModule } from "../../shared/pipes/sort-by.pipe";
import { FirstLetterUppercasePipeModule } from "../../shared/pipes/first-letter-uppercase.pipe";
import { HighlightPipeModule } from "../../shared/pipes/highlight.pipe";
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';


@NgModule({
    declarations: [
        DropFileComponent,
        PrediccionesComponent
    ],
    providers: [
        PrediccionesService,
        GlobalProviders,
        { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        PrediccionesRoutingModule,
        MatIconModule,
        NgxFileDropModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        SortByPipeModule,
        MatSelectModule,
        MatButtonModule,
        FirstLetterUppercasePipeModule,
        HighlightPipeModule,
        MatTabsModule,
        MatOptionModule
    ]
})
export class PrediccionesModule { }
