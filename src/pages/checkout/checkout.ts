import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  showTabs : boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.showTabs = false;
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

}
