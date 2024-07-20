import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { authGuardFn } from './core/guards/auth-is-authenticated.guard';
import { redirectIfAuthenticatedGuardFn } from './core/guards/redirect-if-authenticated.guard';
import { rolGuardFn } from './core/guards/rol.guard';

const routes: Routes = [
  {
    path: '',
    data: { preload: true },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', canMatch: [redirectIfAuthenticatedGuardFn], loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
    ]
  },
  {
    path: 'ventas',
    component: LayoutComponent,
    canMatch: [authGuardFn],
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/ventas/ventas.module').then(m => m.VentasModule) }
    ]
  },
  {
    path: 'gestion-clientes',
    component: LayoutComponent,
    canMatch: [authGuardFn, rolGuardFn],
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/gestion-clientes/gestion-clientes.module').then(m => m.GestionClientesModule) }
    ]
  },
  {
    path: 'gestion-productos',
    component: LayoutComponent,
    canMatch: [authGuardFn, rolGuardFn],
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/gestion-productos/gestion-productos.module').then(m => m.GestionProductosModule) }
    ]
  },
  {
    path: 'gestion-empleados',
    component: LayoutComponent,
    canMatch: [authGuardFn, rolGuardFn],
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/gestion-empleados/gestion-empleados.module').then(m => m.GestionEmpleadosModule) }
    ]
  },
  {
    path: 'gestion-ventas',
    component: LayoutComponent,
    canMatch: [authGuardFn, rolGuardFn],
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/gestion-ventas/gestion-ventas.module').then(m => m.GestionVentasModule) }
    ]
  },
  {
    path: 'gestion-usuarios',
    component: LayoutComponent,
    canMatch: [authGuardFn, rolGuardFn],
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/gestion-usuarios/gestion-usuarios.module').then(m => m.GestionUsuariosModule) }
    ]
  },
  {
    path: 'graficos-ventas',
    component: LayoutComponent,
    canMatch: [authGuardFn, rolGuardFn],
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/graficos-ventas/graficos-ventas.module').then(m => m.GraficosVentasModule) }
    ]
  },
  {
    path: 'predicciones',
    component: LayoutComponent,
    canMatch: [authGuardFn, rolGuardFn],
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/predicciones/predicciones.module').then(m => m.PrediccionesModule) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
