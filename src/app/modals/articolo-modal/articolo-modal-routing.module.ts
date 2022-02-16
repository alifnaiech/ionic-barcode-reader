import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticoloModalPage } from './articolo-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ArticoloModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticoloModalPageRoutingModule {}
