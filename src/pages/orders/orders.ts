import {
  Component
} from '@angular/core';
import {
  IonicPage,
  Nav,
  ModalController
} from 'ionic-angular';
import {
  ServerService
} from "../../services/server.service";
import {
  Storage
} from '@ionic/storage'
@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  constructor(public navCtrl: Nav, private serverService: ServerService, private storage: Storage, public modalCtrl: ModalController) {
    this.getOrders('') 
  }
  orderList : any ;
  orderCount : any ;
  searchQuery: string = '';

  getOrders(refresher) {
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        this.serverService.getAllOrders(userLoginInfo["customer_id"])
        .subscribe(orders => {
          this.orderList = orders.product;
          this.orderCount =orders.product.length;
          if(refresher!=''){
              refresher.complete();
          }
        });
      };
    })
  }

  getItems(ev: any) {
    const val = ev.target.value;
    if(!val) this.getOrders('');

    if (val && val.trim() != '') {
      this.orderList = this.orderList.filter((item) => {
        return (item.order_no.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.order_status.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.added_on.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.delivery_date.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.payment_status.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.total_amount.toLowerCase().indexOf(val.toLowerCase()) > -1 );
      })
    }
  }
  getOrderDetails(orderId){
    let orderModal = this.modalCtrl.create("OrderinfoPage",{orderId : orderId});
    orderModal.onDidDismiss((response) => {
        this.navCtrl.setRoot('OrdersPage');
    });
    orderModal.present();
  }
  
}
