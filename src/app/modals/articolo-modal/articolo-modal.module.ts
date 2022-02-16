import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArticoloModalPageRoutingModule } from './articolo-modal-routing.module';

import { ArticoloModalPage } from './articolo-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArticoloModalPageRoutingModule
  ],
  declarations: [ArticoloModalPage]
})
export class ArticoloModalPageModule {}
