import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams, Events } from 'ionic-angular';
import { Product } from '../../models/product.interface';
// import { ProductServiceProvider } from '../../providers/product-service/product.service';
import { ServerService } from "../../services/server.service";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  products : Product[];
  productDetail : Product;
  constructor(public navCtrl: Nav, public navParams: NavParams, public events: Events ,private serverService: ServerService) {}

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
  }

}
