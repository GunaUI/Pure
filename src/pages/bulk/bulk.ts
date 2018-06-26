import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams, LoadingController, ToastController} from 'ionic-angular';
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
  selector: 'page-bulk',
  templateUrl: 'bulk.html',
})
export class BulkPage {

productInfo : Product
google: google;
model: any = {
    qty : 3,
    emptyCan : 1,
    delivery : '9AM to 12AM',
    price : 'Rs.780',
    flat : '',
    address : '',
    landmark : '',
    city : '',
    zipcode : '',
    latitude : '',
    longitude : ''
  };
  
  constructor(private navCtrl: Nav, private navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {}

  ionViewWillLoad() {
    console.log('bulk',this.navParams.data);
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
    this.navCtrl.setRoot('HomePage');
  }

}
