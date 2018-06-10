import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../models/product.interface';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  productInfo : Product
  model: any = {
    qty : 0,
    emptyCan : 0,
    delivery : '9AM to 12AM'
  };
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewWillLoad() {
  this.productInfo = this.navParams.get('productInfo');
  }

}
