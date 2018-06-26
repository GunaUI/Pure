import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams, Events } from 'ionic-angular';
import { Product } from '../../models/product.interface';
import { ProductServiceProvider } from '../../providers/product-service/product.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  products : Product[];
  productDetail : Product;
  showTabs = false;
  constructor(public navCtrl: Nav, public navParams: NavParams, private prodService : ProductServiceProvider , public events: Events) {}

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
