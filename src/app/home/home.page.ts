import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import Quagga from '@ericblade/quagga2';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import jsQR from 'jsqr';
import { MultiFormatReader, BarcodeFormat } from '@zxing/library';
import { BeepService } from '../services/beep.service';
import { Html5QrcodeScanner } from "html5-qrcode"
import { ToastController } from '@ionic/angular';
import { ArticoloModalPage } from '../modals/articolo-modal/articolo-modal.page';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  
  public html5QrcodeScanner: any;
  // public items: IArticle [] = [
  //   {
  //     IDRigaDocumento: -1,
  //     Barcode: '85558596',
  //     Note: 'sadfl alksjdflk',
  //     Urgente: 1,
  //     Quantita: 3
  //   },
  //   {
  //     IDRigaDocumento: -1,
  //     Barcode: '548469584',
  //     Note: 'sdflk',
  //     Urgente: 1,
  //     Quantita: 4
  //   },
  //   {
  //     IDRigaDocumento: -1,
  //     Barcode: '999586536',
  //     Note: 'sad jdflk',
  //     Urgente: 1,
  //     Quantita: 35
  //   }
  // ];
  public items: IArticle [] = [];
  public article: IArticle;
  public lastScannedCode: string = '';
  public isLastScannedCode: string = '';
  public result: any;
  public scanActive = false;
  public pluginBarcodeScanner = {
    onWeb: 'web',
    onApp: 'app'
  }
  public currentPlatform: string = '';
  constructor(private beepService: BeepService,
              private changeDetectorRef: ChangeDetectorRef,
              public toastController: ToastController,
              public modalController: ModalController,
              public alertController: AlertController,
              public platform: Platform) {
               if(this.platform.is("mobileweb" || "desktop")){
                 this.currentPlatform = this.pluginBarcodeScanner.onWeb
              }else{
                 this.currentPlatform = this.pluginBarcodeScanner.onApp
               }
    
  }



  ngOnInit(){

  }

  ngOnDestroy(): void {
      BarcodeScanner.stopScan();
  }

  
  async ngAfterViewInit(){
    if(this.currentPlatform=='web'){
      this.html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', { fps: 30, qrbox: { width: 250, height: 250 }}, false);
      this.html5QrcodeScanner.render((text, result) => this.onScanSuccess(text, result));   
    }
    if(this.currentPlatform=='app'){
      BarcodeScanner.prepare();
    }
  }

  async startScanner(){
      const allowed = await this.checkPermission();
      if(allowed){
        this.scanActive = true;
        const result = await BarcodeScanner.startScan();
        if(result.hasContent){
          this.onScanSuccess(result.content, null)
          this.result = result.content;
          this.scanActive = false
        }
        
      }
      
      
    }
  

  async checkPermission(){
    return new Promise(async (resolve, reject)=>{
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted){
        resolve(true);
      }else if (status.denied){
        const alert = await this.alertController.create({
          header: 'No permission',
          message: 'Please allow camerea access in your settings',
          buttons: [
            {
              text: 'No',
              role: 'cancel'
            },
            {
              text: 'Open Settings',
              handler: ()=>{
                BarcodeScanner.openAppSettings();
                resolve(false);
              }
            }
          ]
        });
        await alert.present();
      }else{
        resolve(false)
      }

    })
  }

  stopScanner(){
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }



  startScannerOnWeb(){
    this.html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', { fps: 30, qrbox: { width: 250, height: 250 }}, false);
    this.html5QrcodeScanner.render((text, result) => this.onScanSuccess(text, result));   
  }

  stopScannerOnWeb(){

  }
  

    onScanSuccess(decodedText, decodedResult) {
      for(let x of this.items){
        if(x.Barcode==decodedText){
          this.showToast('article already scanned', 'danger')
          return
        }
      }
      this.article = {
        IDRigaDocumento: -1,
        Barcode: decodedText,
        Note: '',
        Quantita: 1,
        Urgente: 0
      }
      this.beepService.beep();
      this.items.push(this.article)
  }




  async editArticle(item){
    const modal = await this.modalController.create({
      component: ArticoloModalPage,
      cssClass: 'modal-edit-article',
      componentProps : {
        'article': item
      }
    })
    modal.onDidDismiss().then((data)=>{
      console.log('data from model on page home --> ', data.data)
    })
    modal.present();
  }

  deleteArticle(item){
    for(let i = 0; i < this.items.length; i++){
      if(this.items[i]['Barcode']=== item){
        this.items.splice(i, 1);
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

  async showToast(_mes, _color) {
    const toast = await this.toastController.create({
      message: _mes,
      color: _color,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }



  
  }



  export interface IArticle{
    IDRigaDocumento?: number;
    Barcode?: string;
    Note?: string;
    Urgente?: number;
    Quantita?: number;
  }