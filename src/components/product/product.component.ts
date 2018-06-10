import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.interface';
import { HomePage } from '../../pages/home/home'
@Component({
  selector: 'product',
  templateUrl: 'product.component.html'
})
export class ProductComponent {

  @Input() productInfo : Product

  constructor(private home : HomePage) {}

  getProductInfo(productInfo){
    this.home.getProductInfo(productInfo);
  }

}
