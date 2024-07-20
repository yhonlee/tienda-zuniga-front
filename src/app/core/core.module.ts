import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MenuComponent } from './menu/menu.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AuthService } from '../modules/auth/services/auth.service';
import { GlobalProviders } from '../shared/interceptors/global.interceptor';
import { ActualizarPasswordPopupComponent } from './toolbar/components/actualizar-password-popup/actualizar-password-popup.component';
import { SnackBarService } from '../shared/services/snack-bar.service';
@NgModule({
  declarations: [
    MenuComponent,
    LayoutComponent,
    ToolbarComponent,
    ActualizarPasswordPopupComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    DialogModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    AuthService,
    SnackBarService,
    GlobalProviders
  ]
})
export class CoreModule { }
