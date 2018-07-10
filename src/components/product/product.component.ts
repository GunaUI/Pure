import {
  Component,
  Input
} from '@angular/core';
import {
  HomePage
} from '../../pages/home/home'
import {
  Platform
} from 'ionic-angular';
@Component({
  selector: 'product',
  templateUrl: 'product.component.html'
})
export class ProductComponent {
  @Input() productInfo: any

  constructor(private home: HomePage,
    public platform: Platform) {}
  getProductInfo(productInfo) {
    this.home.getProductInfo(productInfo);
  }

}
