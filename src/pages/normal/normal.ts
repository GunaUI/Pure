import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavParams, LoadingController, ToastController, PopoverController } from "ionic-angular";
// import { Product } from '../../models/product.interface';
import { ServerService } from "../../services/server.service";
import { NgForm } from '@angular/forms';
import { google } from "google-maps";
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
  submitted = false;
  localityValid=true;
  stateValid=true;
  cityValid=true;
  areaValid=true;
  disableSubmit=true;
  deliveryData= [];

productInfo : any
  google: google;
  model: any = {
    qty : 1,
    emptyCan : 1,
    delivery : '9AM to 12AM',
    total : 0,
    orderCost : 0,
    depositCost : 0,
    expressCost : 0,
    floor : 0,
    floorCharge : 5,
    state:"None Selected",
    state_id:0,
    city:"None Selected",
    city_id:0,
    area:"None Selected",
    area_id:0,
    locality:"None Selected",
    locality_id:0
  };
  
  constructor(private navCtrl: Nav, private navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController,private serverService: ServerService,public popoverCtrl: PopoverController, private storage: Storage) {

  }

  ionViewWillLoad() {
    this.productInfo = this.navParams.data
    this.calculateOrder();
    this.getDelivery();
  }
  ionViewDidEnter() {
    
      this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        var ctrl = this;
        this.serverService.getUser(userLoginInfo["customer_id"])
          .subscribe(user => {
              ctrl.orderForm.form.patchValue({
                orderData: {
                  total : 0,
                  orderCost : 0,
                  depositCost : 0,
                  expressCost : 0,
                  floorCharge : 5,
                  address: user["customer"]["address"],
                  floor: user["customer"]["floor_number"],
                  lift: user["customer"]["lift_access"],
                  state: user["customer"]["state_name"],
                  state_id: user["customer"]["state_id"],
                  city: user["customer"]["city_name"],
                  city_id: user["customer"]["city_id"],
                  // landmark:  user["landmark"],
                  area: user["customer"]["area_name"],
                  area_id: user["customer"]["area_id"],
                  locality: user["customer"]["locality_name"],
                  locality_id: user["customer"]["locality_id"],
                  zipcode: user["customer"]["pincode"]
                },
              });
              ctrl.model.state = user["customer"]["state_name"];
              ctrl.model.state_id = user["customer"]["state_id"];
              ctrl.model.city = user["customer"]["city_name"];
              ctrl.model.city_id = user["customer"]["city_id"];
              // ctrl.model.landmark = user["customer"]["landmark"];
              ctrl.model.area = user["customer"]["area_name"];
              ctrl.model.area_id = user["customer"]["area_id"];
              ctrl.model.locality = user["customer"]["locality_name"];
              ctrl.model.locality_id = user["customer"]["locality_id"];
              ctrl.model.zipcode = user["customer"]["pincode"];
              if(user["customer"]["state_id"]!=0 && user["customer"]["city_id"]!=0 && user["customer"]["area_id"]!=0 && user["customer"]["locality_id"]!=0){
              ctrl.disableSubmit = false;
            }
        });
      } else {
        console.log('test');
      }
    })
  }

  checkout(){
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
      var ctrl = this;
      this.model.image_url = this.productInfo.image_url;
      this.model.name = this.productInfo.product_name;
      this.model.prod_cost = this.productInfo.mrp;
      this.model.address = this.orderForm.value.orderData.address;
      this.model.floor = this.orderForm.value.orderData.floor;
      this.model.landmark = this.orderForm.value.orderData.landmark;
      this.model.lift = this.orderForm.value.orderData.lift;
      this.model.zipcode = this.orderForm.value.orderData.zipcode;
        setTimeout(()=>{
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "address": `${this.model.address} ${this.model.locality}  ${this.model.area} ${this.model.city} ${this.model.state} ${this.model.zipcode}`
        }, function(results) {
          if(results[0]!=undefined){
            ctrl.model.latitude = results[0].geometry.location.lat();
            ctrl.model.longitude = results[0].geometry.location.lng();
            loader.dismiss();
            ctrl.navCtrl.push('CheckoutPage',{
              orderInfo : ctrl.model
            });
          }else{
            let toast = ctrl.toastCtrl.create({
                message: 'Please enter valid delivery address',
                duration: 3000
            });
          toast.present();
          loader.dismiss();
          }
        });
      },100);
  }
  backToHome(){
    this.navCtrl.setRoot('HomePage');
  }
  reduceQty(type){
    if(type=='order'){
      if(this.model.qty>1){
        this.model.qty -= 1;
      }
    }else{
      if(this.model.emptyCan>0){
        this.model.emptyCan -= 1;
      }
    }
    this.calculateOrder();
  }
  increaseQty(type){
    if(type=='order'){
      this.model.qty += 1;
    }else{
      if(this.model.emptyCan<this.model.qty){
        this.model.emptyCan += 1;
      }else{
        this.toastCtrl.create({
          message: "Return quantity can't exceed order quantity",
          position: 'middle',
          duration: 2000,
          showCloseButton: true
        }).present();
      }
    }
    this.calculateOrder();
  }

  calculateOrder(){
    let orderQty : number = parseInt(this.model.qty);
    let returnQty : number = parseInt(this.model.emptyCan);
    if(orderQty==NaN || returnQty==NaN){
      this.toastCtrl.create({
          message: "Please enter valid input",
          position: 'middle',
          duration: 2000,
          showCloseButton: true
        }).present();
        if(orderQty==NaN){
          orderQty = 1;
          this.model.qty = 1;
        }else if(returnQty==NaN){
          returnQty = 1;
          this.model.returnQty = 1;
        }
    }else{
        this.model.orderCost = orderQty * parseInt(this.productInfo.mrp);
        let depositQty = orderQty-returnQty;
        if(depositQty > 0){
          this.model.depositCost = depositQty * parseInt(this.productInfo.deposited_amount)
        }else{
          this.model.depositCost = 0 ;
        }
        if(this.model.delivery=='express'){
          this.model.expressCost = 10 ;
        }else{
          this.model.expressCost = 0 ;
        }
        this.model.total = parseInt(this.model.orderCost + this.model.depositCost + this.model.expressCost + this.model.floorCharge);
    }
  }
  getState(ev){
      var ctrl = this; 
      this.serverService.getState()
        .subscribe( states => {
        let listData = states.state 
        let popover = this.popoverCtrl.create('SearchSelectPage', {listData, fromPage: 'state'});
        popover.present({
        ev: ev
        });
        popover.onDidDismiss(data => {
          if(data!=null && data.state_id!=0){
            ctrl.model.state=data.state_name;
            ctrl.model.state_id=data.state_id;
            this.stateValid = true;
          }else{
            this.stateValid = false;
            this.disableSubmit = true;
          }
        })
      });
  }

  getCity(ev){
    if(this.model.state_id!=0 && this.model.state_id!=null){
      var ctrl = this; 
      this.serverService.getCityById(this.model.state_id,'')
        .subscribe( city => {
        let listData = city.city 
        let popover = this.popoverCtrl.create('SearchSelectPage', {listData, fromPage: 'city', pageId: this.model.state_id});
        popover.present({
        ev: ev
        });
        popover.onDidDismiss(data => {
          if(data!=null){
            ctrl.cityValid = true;
            ctrl.model.city=data.city_name;
            ctrl.model.city_id=data.city_id;
          }
        })
      });
    }else{
      this.cityValid = false;
      this.disableSubmit = true;
    }
  }

  getArea(ev){
    if(this.model.city_id!=0 && this.model.city_id!=null){
      var ctrl = this; 
      this.serverService.getAreaById(this.model.city_id,'')
        .subscribe( area => {
        let listData = area.area 
        let popover = this.popoverCtrl.create('SearchSelectPage', {listData, fromPage: 'area', pageId: this.model.city_id});
        popover.present({
        ev: ev
        });
        popover.onDidDismiss(data => {
          if(data!=null){
            ctrl.areaValid = true;
            ctrl.model.area=data.area_name;
            ctrl.model.area_id=data.area_id;
          }
        })
      });
    }else{
      this.areaValid = false;
      this.disableSubmit = true;
    }
  }
  getLocality(ev){
    // this.disableSubmit = true;
    if(this.model.area_id!=0 && this.model.area_id!=null){
      var ctrl = this; 
      this.serverService.getLocationById(this.model.area_id,'')
        .subscribe( locality => {
        let listData = locality.location 
        let popover = this.popoverCtrl.create('SearchSelectPage', {listData, fromPage: 'locality', pageId: this.model.area_id});
        popover.present({
        ev: ev
        });
        popover.onDidDismiss(data => {
          if(data!=null){
            ctrl.localityValid = true;
            ctrl.disableSubmit = false;
            ctrl.model.locality=data.locality_name;
            ctrl.model.locality_id=data.locality_id;
          }
        })
      });
    }else{
      this.disableSubmit = true;
      this.localityValid = false;
    }
  }

  getDelivery(){
     this.serverService.getDelivery()
     .subscribe(data =>{
        this.deliveryData=data.deliverySlot;
     });
     console.log(this.deliveryData);
   }

}
