import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  orderInfo : any;
  grandTotal : number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private storage: Storage, private alertCtrl : AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  ionViewWillLoad() {
    this.storage.get('cartData').then((data) => {
      if(data!=null){
        this.orderInfo = data;
        this.grandTotal = data.grandOrderTotal;
      }else{
        this.viewCtrl.dismiss();
        this.navCtrl.setRoot('HomePage');
      }
    });
  }
  removeItem(index){
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you agree to remove this item from list?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
              this.orderInfo.splice(index,1);
              this.orderInfo.grandOrderTotal= this.orderInfo.reduce((a, b) => a + b["subtotal"], 0);
              this.orderInfo.totalOrderQuantity= this.orderInfo.reduce((a, b) => a + b["qty"], 0);
              this.orderInfo.totalReturnQuantity= this.orderInfo.reduce((a, b) => a + b["emptyCan"], 0);
              this.orderInfo.totalDepositCost= this.orderInfo.reduce((a, b) => a + b["depositCost"], 0);
              this.orderInfo.totalOrderCost= this.orderInfo.reduce((a, b) => a + b["orderCost"], 0);
              this.storage.set('cartData',this.orderInfo);
              this.grandTotal = this.orderInfo.grandOrderTotal;
          }
        }
      ]
    });
    confirm.present();
  }
  editItem(index,productDetails){
    productDetails.cartId=index;
    this.viewCtrl.dismiss(productDetails);
  }

}
