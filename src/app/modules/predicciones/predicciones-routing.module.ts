import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrediccionesComponent } from './predicciones.component';

const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: PrediccionesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrediccionesRoutingModule { }
