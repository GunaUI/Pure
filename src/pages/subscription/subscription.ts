import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {

  constructor(public navCtrl: Nav, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionPage');
  }

}
