import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.interface';
import { HomePage } from '../../pages/home/home'
import {Platform} from 'ionic-angular';
@Component({
  selector: 'product',
  templateUrl: 'product.component.html'
})
export class ProductComponent {

  @Input() productInfo : any
  apiUrl : any


  constructor(private home : HomePage,
                public platform: Platform) {

      // if (this.platform.is('cordova')) {              
      //     this.apiUrl = 'http://puredip.deforay.in/';
      // }
    }

  getProductInfo(productInfo){
    this.home.getProductInfo(productInfo);
  }

}
