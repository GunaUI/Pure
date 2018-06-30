import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams, LoadingController, ToastController } from "ionic-angular";
import { Product } from '../../models/product.interface';
// import { google } from "google-maps";

@IonicPage()
@Component({
  selector: 'page-normal',
  templateUrl: 'normal.html',
})
export class NormalPage {

productInfo : Product
  // google: google;
  model: any = {
    qty : 1,
    emptyCan : 1,
    delivery : '9AM to 12AM',
    total : 0,
    orderCost : 0,
    depositCost : 0,
    expressCost : 0,
    floorCharge : 5,
    latitude : '13.062329',
    longitude : '80.203372'
  };
  
  constructor(private navCtrl: Nav, private navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {

  }

  ionViewWillLoad() {
    this.productInfo = this.navParams.data
    this.calculateOrder();
  }

  // getGeolocation(data){
  //     var ctrl = this; 
  //     const loader = this.loadingCtrl.create({
  //       content: "Please wait..."
  //     });
  //     loader.present();
  //     setTimeout(()=>{
  //       var geocoder = new google.maps.Geocoder();
  //       geocoder.geocode({
  //         "address": `${data.flat} ${data.address}  ${data.city} ${data.zipcode}`
  //       }, function(results) {
  //         if(results[0]!=undefined){
  //           data.latitude = results[0].geometry.location.lat();
  //           data.longitude = results[0].geometry.location.lng();
  //           data.image_url = ctrl.productInfo.image_url;
  //           data.name = ctrl.productInfo.name;
  //           data.prod_cost = ctrl.productInfo.prod_cost;
  //           loader.dismiss();
  //           ctrl.navCtrl.push('CheckoutPage',{
  //             orderInfo : data
  //           });
  //         }else{
  //           let toast = ctrl.toastCtrl.create({
  //               message: 'Please enter valid delivery address',
  //               duration: 3000
  //           });
  //         toast.present();
  //         loader.dismiss();
  //         }
  //       });
  //     },100);
  // }

  checkout(){
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

      this.model.image_url = this.productInfo.image_url;
      this.model.name = this.productInfo.name;
      this.model.prod_cost = this.productInfo.prod_cost;
      loader.dismiss();
      this.navCtrl.push('CheckoutPage',{
        orderInfo : this.model
      });
  }

  backToHome(){
    this.navCtrl.setRoot('HomePage');
  }
  reduceQty(type){
    if(type=='order'){
      if(this.model.qty>1){
        this.model.qty -= 1;
      }
    }else{
      if(this.model.emptyCan>0){
        this.model.emptyCan -= 1;
      }
    }
    this.calculateOrder();
  }
  increaseQty(type){
    if(type=='order'){
      this.model.qty += 1;
    }else{
      if(this.model.emptyCan<this.model.qty){
        this.model.emptyCan += 1;
      }else{
        this.toastCtrl.create({
          message: "Return quantity can't exceed order quantity",
          position: 'middle',
          duration: 2000,
          showCloseButton: true
        }).present();
      }
    }
    this.calculateOrder();
  }

  calculateOrder(){
    let orderQty : number = parseInt(this.model.qty);
    let returnQty : number = parseInt(this.model.emptyCan);
    if(orderQty==NaN || returnQty==NaN){
      this.toastCtrl.create({
          message: "Please enter valid input",
          position: 'middle',
          duration: 2000,
          showCloseButton: true
        }).present();
        if(orderQty==NaN){
          orderQty = 1;
          this.model.qty = 1;
        }else if(returnQty==NaN){
          returnQty = 1;
          this.model.returnQty = 1;
        }
    }else{
        this.model.orderCost = orderQty * 30 ;
        let depositQty = orderQty-returnQty;
        if(depositQty > 0){
          this.model.depositCost = depositQty * 100
        }else{
          this.model.depositCost = 0 ;
        }
        if(this.model.delivery=='express'){
          this.model.expressCost = 10 ;
        }else{
          this.model.expressCost = 0 ;
        }
        this.model.total = parseInt(this.model.orderCost + this.model.depositCost + this.model.expressCost + this.model.floorCharge);
    }
  }

}
