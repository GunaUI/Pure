import {
  Component,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  Nav,
  NavParams,
  ToastController,
  ModalController
} from "ionic-angular";
import {
  NgForm
} from '@angular/forms';
import {
  Storage
} from '@ionic/storage'
@IonicPage()
@Component({
  selector: 'page-normal',
  templateUrl: 'normal.html',
})
export class NormalPage {
  @ViewChild('orderForm') orderForm: NgForm;
  productInfo: any
  cartCount: any
  model: any = {
    qty: 1,
    emptyCan: 1,
    subtotal: 0,
    orderCost: 0,
    depositCost: 0,
    type: 'normal'
  };
  constructor(private navCtrl: Nav, private navParams: NavParams, private toastCtrl: ToastController, private storage: Storage, public modalCtrl: ModalController) {
    this.productInfo = this.navParams.data;
  }
  ionViewWillLoad() {
    this.model.bulk_price = parseInt(this.productInfo.bulk_price);
    this.model.category_name = this.productInfo.category_name;
    this.model.dealer_price = this.productInfo.dealer_price;
    this.model.deposited_amount = this.productInfo.deposited_amount;
    this.model.mrp = this.productInfo.mrp;
    this.model.product_category_id = this.productInfo.product_category_id;
    this.model.product_id = this.productInfo.product_id;
    this.model.product_image = this.productInfo.product_image;
    this.model.product_name = this.productInfo.product_name;
    if (this.productInfo.qty) {
      this.model.qty = this.productInfo.qty;
      this.model.emptyCan = this.productInfo.emptyCan;
      this.model.subtotal = this.productInfo.subtotal;
      this.model.orderCost = this.productInfo.orderCost;
      this.model.depositCost = this.productInfo.depositCost;
    }
    this.calculateOrder();
    this.storage.get('cartData').then((data) => {
      if (data != null) {
        this.cartCount = data.length;
      } else {
        this.cartCount = 0;
      }
    });
  }
  checkout() {
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        let detModal = this.modalCtrl.create('CartPage');
        detModal.onDidDismiss((response) => {
          if (response != undefined) {
            if (response.type == 'bulk') {
              this.navCtrl.setRoot('BulkPage', response);
            } else if (response.type == 'checkout') {
              this.navCtrl.setRoot('CheckoutPage', response);
            } else if (response.type == 'normal') {
              this.navCtrl.setRoot('NormalPage', response);
            } else {
              this.navCtrl.setRoot('HomePage')
            }
          } else {
            this.storage.get('cartData').then((data) => {
              this.cartCount = data.length;
            });
          }
        });
        detModal.present();
      } else {
        this.navCtrl.setRoot('LoginPage');
      }
    })
  }
  updateCart(productInfo) {
    if (this.model.emptyCan == "") {
      this.model.emptyCan = 0;
    }
    this.storage.get('cartData').then((data) => {
      if (data == null) {
        data = [];
        data.grandOrderTotal = 0;
        data.totalOrderQuantity = 0;
        data.totalReturnQuantity = 0;
        data.totalDepositCost = 0;
        data.totalOrderCost = 0;
      }
      data.splice(productInfo.cartId, 1);
      data.push(this.model);
      data.grandOrderTotal = data.reduce((a, b) => a + b["subtotal"], 0);
      data.totalOrderQuantity = data.reduce((a, b) => a + b["qty"], 0);
      data.totalReturnQuantity = data.reduce((a, b) => a + b["emptyCan"], 0);
      data.totalDepositCost = data.reduce((a, b) => a + b["depositCost"], 0);
      data.totalOrderCost = data.reduce((a, b) => a + b["orderCost"], 0);
      this.storage.set('cartData', data);
      this.toastCtrl.create({
        message: " Success : Cart datails updated !!",
        position: 'middle',
        showCloseButton: true,
        duration: 3000,
        closeButtonText: 'Ok!',
        dismissOnPageChange: true,
        cssClass: "toast-success"
      }).present();
    });
  }
  addToCart() {
    if (this.model.emptyCan == "") {
      this.model.emptyCan = 0;
    }
    this.storage.get('cartData').then((data) => {
      if (data == null) {
        data = [];
        data.grandOrderTotal = 0;
        data.totalOrderQuantity = 0;
        data.totalReturnQuantity = 0;
        data.totalDepositCost = 0;
        data.totalOrderCost = 0;
      }
      data.push(this.model);
      data.grandOrderTotal = data.reduce((a, b) => a + b["subtotal"], 0);
      data.totalOrderQuantity = data.reduce((a, b) => a + b["qty"], 0);
      data.totalReturnQuantity = data.reduce((a, b) => a + b["emptyCan"], 0);
      data.totalDepositCost = data.reduce((a, b) => a + b["depositCost"], 0);
      data.totalOrderCost = data.reduce((a, b) => a + b["orderCost"], 0);

      this.storage.set('cartData', data);
      this.cartCount = data.length;
      this.toastCtrl.create({
        message: " Success : Added to card !!",
        position: 'middle',
        showCloseButton: true,
        duration: 3000,
        closeButtonText: 'Ok!',
        dismissOnPageChange: true,
        cssClass: "toast-success"
      }).present();
    });
  }
  backToHome() {
    this.navCtrl.setRoot('HomePage');
  }
  reduceQty(type) {
    if (type == 'order') {
      let initialQty = parseInt(this.model.qty);
      if (parseInt(this.model.qty) > 1) {
        this.model.qty = parseInt(this.model.qty) - 1;
      }
      if (parseInt(this.model.emptyCan) > 0 && this.model.emptyCan > initialQty) {
        this.model.emptyCan = parseInt(this.model.emptyCan) - 1;
      }
    } else if (this.model.emptyCan > 0) {
      this.model.emptyCan = parseInt(this.model.emptyCan) - 1;
    }
    this.calculateOrder();
  }
  increaseQty(type) {
    if (type == 'order') {
      this.model.qty = parseInt(this.model.qty) + 1;
    } else {
      if (parseInt(this.model.emptyCan) < parseInt(this.model.qty)) {
        this.model.emptyCan = parseInt(this.model.emptyCan) + 1;
      } else {
        this.toastCtrl.create({
          message: " Warning !! : Return quantity can't exceed order quantity",
          position: 'top',
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'Got it!',
          dismissOnPageChange: true,
          cssClass: "toast-warning",
        }).present();
      }
    }
    this.calculateOrder();
  }
  calculateOrder() {
    let orderQty: number = parseInt(this.model.qty) > 0 ? parseInt(this.model.qty) : 0;
    let returnQty: number = parseInt(this.model.emptyCan) > 0 ? parseInt(this.model.emptyCan) : 0;
    if (orderQty == NaN || returnQty == NaN) {
      this.toastCtrl.create({
        message: "Please enter valid input",
        position: 'middle',
        duration: 2000,
        showCloseButton: true
      }).present();
      if (orderQty == NaN) {
        orderQty = 1;
        this.model.qty = 1;
      } else if (returnQty == NaN) {
        returnQty = 1;
        this.model.returnQty = 1;
      }
    } else {
      this.model.orderCost = orderQty * parseInt(this.productInfo.mrp);
      let depositQty = orderQty - returnQty;
      if (depositQty > 0) {
        this.model.depositCost = depositQty * parseInt(this.productInfo.deposited_amount)
      } else {
        this.model.depositCost = 0;
        if (parseInt(this.model.emptyCan) > parseInt(this.model.qty)) {
          this.model.emptyCan = parseInt(this.model.qty);
        }
      }
      this.model.subtotal = parseInt(this.model.orderCost + this.model.depositCost);
    }
  }
}
