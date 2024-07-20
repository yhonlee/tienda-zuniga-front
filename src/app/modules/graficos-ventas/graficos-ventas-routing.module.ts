import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficosVentasComponent } from './graficos-ventas.component';

const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: GraficosVentasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraficosVentasRoutingModule { }
