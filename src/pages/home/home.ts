import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams, Events, ToastController, ModalController } from 'ionic-angular';
// import { Product } from '../../models/product.interface';
// import { ProductServiceProvider } from '../../providers/product-service/product.service';
import { ServerService } from "../../services/server.service";
import {
  Storage
} from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  cartCount:any
  products : any;
  productDetail : any;
  constructor(public navCtrl: Nav, public navParams: NavParams, public events: Events ,private serverService: ServerService, private storage: Storage, private toastCtrl: ToastController, public modalCtrl: ModalController) {}

  getProducts(): void{
    // this.prodService.mockgetProduct().subscribe((data : Product[]) => this.products = data);

      this.serverService.getProducts()
        .subscribe( data => {
          if(data.status=='success'){
            this.products = data.product
            console.log(data.product);
          }
      });
  }

  getProductInfo(productDetails) : void{
    this.navCtrl.push('ProductDetailsPage',{
      productInfo : productDetails
    });
  }

  ionViewWillLoad() {
      this.getProducts();
      this.storage.get('cartData').then((data) => {
        if(data!=null){
          this.cartCount = data.length;
        }else{
          this.cartCount = 0;
        }
    });
  }
  checkout(){
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
        if (userLoginInfo != null) {
          let detModal =this.modalCtrl.create('CartPage');
          detModal.onDidDismiss((response) => {
            if(response!=undefined){
              if(response.type=='bulk'){
                this.navCtrl.setRoot('BulkPage',response);
              }else if(response.type=='checkout'){
                this.navCtrl.setRoot('CheckoutPage',response);
              }
              else if(response.type=='normal'){
                this.navCtrl.setRoot('NormalPage',response);
              }else{
                this.navCtrl.setRoot('HomePage')
              }
            }else{
                this.storage.get('cartData').then((data) => {
                this.cartCount = data.length;
              });
            }
          });
          detModal.present();
        }else{
          this.navCtrl.setRoot('LoginPage');
        }
    })
  }
  

}
