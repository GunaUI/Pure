import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../models/product.interface';
import { ProductServiceProvider } from '../../providers/product-service/product.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  products : Product[];
  productDetail : Product
  constructor(public navCtrl: NavController, public navParams: NavParams, private prodService : ProductServiceProvider) {}

  getProducts(): void{
    this.prodService.mockgetProduct().subscribe((data : Product[]) => this.products = data);
  }

  getProductInfo(productDetails) : void{
    this.navCtrl.push('ProductDetailsPage',{
      productInfo : productDetails
    });
  }

  ionViewWillLoad() {
      this.getProducts();
  }

}
