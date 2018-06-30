import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams,} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  tab1Root = "NormalPage";
  tab2Root = "BulkPage";

  myIndex : number;
  constructor(public navCtrl: Nav, public navParams: NavParams) {
    this.myIndex = this.navParams.data.tabIndex || 0 ;
  }

  ionViewDidLoad() {
    //this.productInfo = this.navParams.get('productInfo');
    console.log('ionViewDidLoad TabsPage', this.navParams.get('productInfo'));
  }

}
