import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionVentasComponent } from './gestion-ventas.component';

const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: GestionVentasComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionVentasRoutingModule { }
