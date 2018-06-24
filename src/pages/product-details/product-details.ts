import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  tab1Root = "NormalPage";
  tab2Root = "BulkPage";
  showTabs : boolean;

  myIndex : number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.myIndex = this.navParams.data.tabIndex || 0 ;
    this.showTabs = true;
  }

  ionViewDidLoad() {
    //this.productInfo = this.navParams.get('productInfo');
    console.log('ionViewDidLoad TabsPage', this.navParams.get('productInfo'));
  }

}
