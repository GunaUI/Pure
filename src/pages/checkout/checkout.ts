import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Nav, NavParams,AlertController } from 'ionic-angular';
import { google } from "google-maps";

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  orderInfo : any
  google: google;
  @ViewChild('map') mapRef: ElementRef;
  constructor(public navCtrl: Nav, public navParams: NavParams, private alertCtrl : AlertController) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }
  ionViewWillLoad() {
    this.orderInfo = this.navParams.get('orderInfo');
    const location = new google.maps.LatLng(this.orderInfo.latitude, this.orderInfo.longitude);
    const options = {
      center:location,
      zoom : 13
    }
    const map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.addMarker(location, map)
  }
  addMarker(position, map){
    return new google.maps.Marker({
      position,
      map
    });
  }

  openOrders(){
    this.alertCtrl.create({
          title : "Order Saved Successfully!!",
          message : "Will deliver shortly.",
          buttons: [{
            text: "OK",
            handler: () => {
              this.navCtrl.setRoot("OrdersPage");
            }
          }]
        }).present()
    
  }

}
