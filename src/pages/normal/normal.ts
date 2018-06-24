import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { Product } from '../../models/product.interface';
import { google } from "google-maps";
/**
 * Generated class for the NormalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-normal',
  templateUrl: 'normal.html',
})
export class NormalPage {

productInfo : Product
  google: google;
  model: any = {
    qty : 1,
    emptyCan : 1,
    delivery : '9AM to 12AM',
    price : 'Rs.780',
    flat : '',
    floor : '',
    address : '',
    landmark : '',
    city : '',
    zipcode : '',
    latitude : '',
    longitude : ''
  };
  
  constructor(private navCtrl: NavController, private navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController , public events: Events) {}

  ionViewWillLoad() {
    this.productInfo = this.navParams.data
  }

  getGeolocation(data){
      var ctrl = this; 
      const loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      setTimeout(()=>{
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "address": `${data.flat} ${data.address}  ${data.city} ${data.zipcode}`
        }, function(results) {
          if(results[0]!=undefined){
            data.latitude = results[0].geometry.location.lat();
            data.longitude = results[0].geometry.location.lng();
            data.image_url = ctrl.productInfo.image_url;
            data.name = ctrl.productInfo.name;
            data.prod_cost = ctrl.productInfo.prod_cost;
            loader.dismiss();
            ctrl.navCtrl.push('CheckoutPage',{
              orderInfo : data
            });
          }else{
            let toast = ctrl.toastCtrl.create({
                message: 'Please enter valid delivery address',
                duration: 3000
            });
          toast.present();
          loader.dismiss();
          }
        });
      },100);
  }
  backToHome(){
    this.events.publish('goToHome');
  }

}
