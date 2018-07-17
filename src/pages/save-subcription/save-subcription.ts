import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, AlertController, } from 'ionic-angular';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { ServerService } from "../../services/server.service";
import { Storage } from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-save-subcription',
  templateUrl: 'save-subcription.html',
})
export class SaveSubcriptionPage {
  productInfo: any;
  jsonData:any;
  order:any;
  deliveryData : any = '';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, public viewCtrl: ViewController, private selector: WheelSelector,private serverService: ServerService, private storage: Storage,private alertCtrl : AlertController) {
    this.productInfo = this.navParams.data;
    toastCtrl.create({
        message: "Recurring deliveries offers registered Puredip Business customers the convenience of automatic deliveries in addition to competitive pricing and free standard shipping. There are no commitments, obligations or fees, and you can cancel a recurring order at any time. ",
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Got it!',
        dismissOnPageChange: true,
        duration:8000,
        cssClass: "toast-warning"
      }).present();

      this.jsonData = {
        numbers: [
        ]
      };
      
      Array.from(new Array(100),(val,index)=>{
        this.jsonData.numbers.push({ description: (index+1)+"" })
      });
      this.order ={
          orderQuantity : (this.productInfo["order_quantity"]!=undefined && this.productInfo["order_quantity"]!=null) ? this.productInfo["order_quantity"] : 3,
          numOfDaysOnce: (this.productInfo["no_of_days_once"]!=undefined && this.productInfo["no_of_days_once"]!=null) ? this.productInfo["no_of_days_once"] : 7,
          deliveryTime:'',
          subscribeStatus:'enabled',
          productId:this.productInfo.product_id
      }
      this.getDelivery();
  }
  getDelivery(){
      this.serverService.getDelivery('?today=yes')
        .subscribe( data => {
          this.deliveryData =data.deliverySlot;
          this.order.deliveryTime= this.deliveryData[0].id
          
      });
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  selectCan() {
    this.selector.show({
      title: "How many can(s) ?",
      items: [
        this.jsonData.numbers
      ],
      defaultItems: [ 
        { index: 0, value: this.jsonData.numbers[this.order.orderQuantity-1].description },
      ]
    }).then(
      result => {
        this.order.orderQuantity = result[0].description;
      },
      err => console.log('Error: ', err)
    );
  }
  selectFrequency() {
    this.selector.show({
      title: "Once in how many days?",
      items: [
        this.jsonData.numbers
      ],
      defaultItems: [ 
        { index: 0, value: this.jsonData.numbers[this.order.numOfDaysOnce-1].description },
      ]
    }).then(
      result => {
        this.order.numOfDaysOnce = result[0].description;
      },
      err => console.log('Error: ', err)
    );
  }
  saveRecurringOrder(){
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        if(this.productInfo["recurrence_order_id"]!=undefined && this.productInfo["recurrence_order_id"]!=null){
          var data = {
            customerID : userLoginInfo["customer_id"],
            order: [this.order],
            recurrenceOrderId:this.productInfo["recurrence_order_id"]
          }
          this.serverService.postData('/api/recurrence-order', data).then((response) => {
            if(response["status"]='success'){
              this.alertCtrl.create({
                title: "Recurring Order Successful",
                message: "Your recurring order saved successfully!.",
                buttons: [{
                  text: "Done",
                  handler: () => {
                    this.viewCtrl.dismiss();
                  }
                }]
              }).present()
            }else{
                this.toastCtrl.create({
                    message: 'Recurring Order Failure!, Please try again or contact admin.',
                    duration: 2000,
                    position: 'middle',
                    showCloseButton: true,
                    closeButtonText: 'Done',
                    dismissOnPageChange: true,
                    cssClass: "toast-error"
                }).present();
            }
          }, (err) => {
            console.log('error', err)
          });
        }else{
          var addData = {
            customerID : userLoginInfo["customer_id"],
            order: [this.order]
          }

          this.serverService.postData('/api/recurrence-order', addData).then((response) => {
            if(response["status"]='success'){
              this.alertCtrl.create({
                title: "Recurring Order Successful",
                message: "Your recurring order saved successfully!.",
                buttons: [{
                  text: "Done",
                  handler: () => {
                    this.viewCtrl.dismiss();
                  }
                }]
              }).present()
            }else{
                this.toastCtrl.create({
                    message: 'Recurring Order Failure!, Please try again or contact admin.',
                    duration: 2000,
                    position: 'middle',
                    showCloseButton: true,
                    closeButtonText: 'Done',
                    dismissOnPageChange: true,
                    cssClass: "toast-error"
                }).present();
            }
          }, (err) => {
            console.log('error', err)
          });
        }
        
      }
    });
  }
}
