import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-articolo-modal',
  templateUrl: './articolo-modal.page.html',
  styleUrls: ['./articolo-modal.page.scss'],
})
export class ArticoloModalPage implements OnInit {
  @Input() article; 
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }


  closeModal(){
    this.modalController.dismiss();
  }

  saveArticle(){
    this.modalController.dismiss(this.article)
  }

}
