import {
  Component
} from '@angular/core';
import {
  IonicPage,
  Nav,
  NavParams,
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  tab1Root: any;
  tab2Root: any;
  productInfo: any
  myIndex: number;
  constructor(public navCtrl: Nav, public navParams: NavParams) {
    this.productInfo = navParams.get('productInfo');
    if (this.productInfo) {
      this.tab1Root = "NormalPage";
      this.tab2Root = "BulkPage";
      this.myIndex = this.navParams.data.tabIndex || 0;
    }
  }
}
