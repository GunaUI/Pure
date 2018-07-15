import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams,ModalController } from 'ionic-angular';
import { ServerService } from "../../services/server.service";
import { Storage } from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {
  orders : any;
  constructor(public navCtrl: Nav, public navParams: NavParams,private serverService: ServerService, private storage: Storage, public modalCtrl: ModalController) {
    this.getSavedOrders();
  }

  getSavedOrders(): void{
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        this.serverService.getRecurringOrder(userLoginInfo["customer_id"])
          .subscribe( data => {
            if(data.status=='success'){
              this.orders = data.order
            }
        });
      }else{
          this.navCtrl.setRoot('LoginPage');
      }
    });
  }
  editItem(order){
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
          let subcription =this.modalCtrl.create('SaveSubcriptionPage',order);
          subcription.onDidDismiss((response) => {
            this.getSavedOrders();
          });
          subcription.present();
      }else{
          this.navCtrl.setRoot('LoginPage');
      }
    });
  }
  doRefresh(refresher){
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        this.serverService.getRecurringOrder(userLoginInfo["customer_id"])
          .subscribe( data => {
            if(data.status=='success'){
              this.orders = data.order;
              refresher.complete();
            }
        });
      }else{
          refresher.complete();
          this.navCtrl.setRoot('LoginPage');
      }
    });
  }
}
