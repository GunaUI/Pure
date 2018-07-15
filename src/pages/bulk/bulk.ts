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
import { ServerService } from "../../services/server.service";

@IonicPage()
@Component({
  selector: 'page-bulk',
  templateUrl: 'bulk.html',
})
export class BulkPage {
  @ViewChild('orderForm') orderForm: NgForm;
  productInfo: any
  cartCount: any
  minQty : any
  model: any = {
    qty: 3,
    emptyCan: 3,
    subtotal: 0,
    orderCost: 0,
    depositCost: 0,
    type: 'bulk'
  };

  constructor(private navCtrl: Nav, private navParams: NavParams, private toastCtrl: ToastController, private storage: Storage, public modalCtrl: ModalController,private serverService: ServerService) {
    this.productInfo = this.navParams.data;
    this.getConfigData();
  }
  getConfigData(): void{
      var ctrl = this;
      this.serverService.getConfig()
        .subscribe( data => {
          if(data["status"]=="success"){
            for (var prop in data["product"]) { 
              if (data["product"][prop]["global_name"]=='bulk_qty'){
                ctrl.model.qty = parseInt(data["product"][prop]["global_value"])
                ctrl.model.emptyCan = parseInt(data["product"][prop]["global_value"])
                ctrl.minQty = parseInt(data["product"][prop]["global_value"]);
              }
            }
          }
      });
  }

  ionViewWillLoad() {
    this.model.bulk_price = parseInt(this.productInfo.bulk_price);
    this.model.category_name = this.productInfo.category_name;
    this.model.dealer_price = this.productInfo.dealer_price;
    this.model.deposited_amount = this.productInfo.deposited_amount;
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
    // this.getDelivery();
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
      if (parseInt(this.model.qty) > this.minQty) {
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
    var ctrl = this;
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
        orderQty = this.minQty;
        this.model.qty = this.minQty;
      } else if (returnQty == NaN) {
        returnQty = this.minQty;
        this.model.returnQty = this.minQty;
      }
    }else if(orderQty< this.minQty){
      this.toastCtrl.create({
          message: " Warning !! : Please enter minimum order quantity of "+ ctrl.minQty +" cans",
          position: 'top',
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'Got it!',
          dismissOnPageChange: true,
          cssClass: "toast-warning",
        }).present();
        this.model.qty = this.minQty;
    } else {
      this.model.orderCost = orderQty * parseInt(this.productInfo.bulk_price);
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
