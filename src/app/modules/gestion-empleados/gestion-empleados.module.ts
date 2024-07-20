import localeEs from '@angular/common/locales/es-PE';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { GestionEmpleadosRoutingModule } from './gestion-empleados-routing.module';
import { GestionEmpleadosComponent } from './gestion-empleados.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { TableComponent } from './components/table/table.component';
import { getSpanishPaginatorIntl } from 'src/app/shared/language/spanish-paginator-intl';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CreacionEmpleadosPopupComponent } from './components/creacion-empleados-popup/creacion-empleados-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GestionEmpleadosService } from './services/gestion-empleados.service';
import { GlobalProviders } from 'src/app/shared/interceptors/global.interceptor';
import { SortByPipeModule } from "../../shared/pipes/sort-by.pipe";
import { HttpClientModule } from '@angular/common/http';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from 'src/app/shared/constants';
import { StateClassButtonPipeModule } from "../../shared/pipes/state-class-button.pipe";

registerLocaleData(localeEs, 'es-PE');

@NgModule({
    declarations: [
        GestionEmpleadosComponent,
        FiltrosComponent,
        TableComponent,
        CreacionEmpleadosPopupComponent
    ],
    providers: [
        GestionEmpleadosService,
        GlobalProviders,
        { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
        { provide: LOCALE_ID, useValue: 'es-PE' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        GestionEmpleadosRoutingModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SortByPipeModule,
        StateClassButtonPipeModule
    ]
})
export class GestionEmpleadosModule { }
