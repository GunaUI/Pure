import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Nav, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { google } from "google-maps";
import { Storage } from '@ionic/storage'
import { NgForm } from '@angular/forms';
import { ServerService } from "../../services/server.service";


@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  orderInfo : any
  @ViewChild('orderForm') orderForm: NgForm;
  @ViewChild('map') mapRef: ElementRef;
  localityValid=true;
  stateValid=true;
  cityValid=true;
  areaValid=true;
  disableSubmit=true;
  deliveryData= [];
  google: google;
  

  model: any = {
    delivery : '9AM to 12AM',
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
  order :any = {};
  
  constructor(public navCtrl: Nav, public navParams: NavParams, private alertCtrl : AlertController, private storage: Storage,private serverService: ServerService,public popoverCtrl: PopoverController) {
  }
  ionViewDidEnter() {
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
       console.log("userLoginInfo#####",userLoginInfo);
      if (userLoginInfo != null) {
        var ctrl = this;
        this.serverService.getUser(userLoginInfo["customer_id"])
        .subscribe(user => {
          console.log("user#####",user);
          ctrl.orderForm.form.patchValue({
            orderData: {
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
  ionViewWillLoad() {
    // this.orderInfo = this.navParams.get('orderInfo');
    // const location = new google.maps.LatLng(this.orderInfo.latitude, this.orderInfo.longitude);
    // const options = {
    //   center:location,
    //   zoom : 13
    // }
    // const map = new google.maps.Map(this.mapRef.nativeElement, options);
    // this.addMarker(location, map)

    this.storage.get('cartData').then((data) => {
      if(data!=null){
        this.orderInfo = data;
        console.log(data) 
      }else{
        this.navCtrl.setRoot('HomePage');
      }
    });
    this.getDelivery();
  }
  // addMarker(position, map){
  //   return new google.maps.Marker({
  //     position,
  //     map
  //   });
  // }

  confirmOrder(){
      this.model.address = this.orderForm.value.orderData.address;
      this.model.floor = this.orderForm.value.orderData.floor;
      this.model.landmark = this.orderForm.value.orderData.landmark;
      this.model.lift = this.orderForm.value.orderData.lift;
      this.model.zipcode = this.orderForm.value.orderData.zipcode;
      this.order.totalOrderQuantity = '1';
      this.order.totalReturnQuantity = '1';
      this.order.totalDepositCost = '100';
      this.order.totalOrderCost = '2';
      this.order.grandOrderTotal = '100';

    // console.log(this.orderForm.value.orderData);
    // console.log(this.model);
    // console.log(this.orderInfo);
    this.order.shipping =this.model;
    this.order.order =this.orderInfo;
    
    console.log(JSON.stringify(this.order));
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
    //  this.serverService.getDelivery()
    //  .subscribe(data =>{
    //     this.deliveryData=data.deliverySlot;
    //  });
    //  console.log(this.deliveryData);
  }

}
