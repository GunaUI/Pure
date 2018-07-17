import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, AlertController, PopoverController, LoadingController, Nav, ToastController } from 'ionic-angular';
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
  @ViewChild('map') mapRef: ElementRef;
  orderInfo : any
  @ViewChild('orderForm') orderForm: NgForm;
  google: google;
  localityValid=true;
  stateValid=true;
  cityValid=true;
  areaValid=true;
  disableSubmit=true;
  deliveryData : any = '';
  grandTotal : number;
  totalOrderQuantity : number;
  totalReturnQuantity : number;
  totalOrderCost : number;
  totalDepositCost : number;
  totalServiceCost : number = 0;
  

  model: any = {
    delivery : '9AM to 12AM',
    expressCost : 0,
    floor : 0,
    floorCharge : 0,
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

  constructor(public navCtrl: Nav,private alertCtrl : AlertController, private storage: Storage,private serverService: ServerService,public popoverCtrl: PopoverController,private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.getConfigData();
  }

  getConfigData(): void{
      var ctrl = this;
      this.serverService.getConfig()
        .subscribe( data => {
          if(data["status"]=="success"){
            for (var prop in data["product"]) { 
              if (data["product"][prop]["global_name"]=='floor_charge'){
                ctrl.model.floorCharge = parseInt(data["product"][prop]["global_value"])
              }
            }
          }
      });
  }


  ionViewWillLoad() {
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      this.getDelivery();
      if (userLoginInfo != null) {
        var ctrl = this;
        this.serverService.getUser(userLoginInfo["customer_id"])
        .subscribe(user => {
          const location = new google.maps.LatLng(user["customer"]["latitude"], user["customer"]["longitude"]);
          const options = {
            center:location,
            zoom : 13
          }
          const map = new google.maps.Map(this.mapRef.nativeElement, options);
          this.addMarker(location, map)

          ctrl.orderForm.form.patchValue({
            orderData: {
              expressCost : 0,
              floorCharge : ctrl.model.floorCharge,
              address: user["customer"]["address"],
              floor: user["customer"]["floor_number"],
              lift: false,
              state: user["customer"]["state_name"],
              state_id: user["customer"]["state_id"],
              city: user["customer"]["city_name"],
              city_id: user["customer"]["city_id"],
              // landmark:  user["landmark"],
              customerName : user["customer"]["customer_name"],
              contactNumber : user["customer"]["mobile"],
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

          ctrl.model.latitude = user["customer"]["latitude"];
          ctrl.model.longitude = user["customer"]["longitude"];

          ctrl.model.customer_id = userLoginInfo["customer_id"];
          if(user["customer"]["state_id"]!=0 && user["customer"]["city_id"]!=0 && user["customer"]["area_id"]!=0 && user["customer"]["locality_id"]!=0){
            ctrl.disableSubmit = false;
          }
          
        });
        ctrl.storage.get('cartData').then((data) => {
            if(data!=null){
              ctrl.orderInfo = data;
              ctrl.totalOrderQuantity = data.totalOrderQuantity;
              ctrl.totalReturnQuantity = data.totalReturnQuantity;
              ctrl.totalOrderCost = data.totalOrderCost;
              ctrl.totalDepositCost = data.totalDepositCost;
              ctrl.grandTotal = data.grandOrderTotal;
            }
        });
      } else {
        console.log('test');
      }
    });
  }
  addMarker(position, map){
    return new google.maps.Marker({
      position,
      map
    });
  }
  getState(ev){
      var ctrl = this; 
      this.serverService.getState()
        .subscribe( states => {
        let listData = states.state 
        let popover = this.popoverCtrl.create('SearchSelectPage', {listData, fromPage: 'state'}, {cssClass: 'custom-popover'});
        popover.present({
        ev: ev
        });
        popover.onDidDismiss(data => {
          if(data!=null && data.state_id!=0){
            ctrl.model.state=data.state_name;
            ctrl.model.state_id=data.state_id;
            ctrl.model.city = "None Selected";
            ctrl.model.city_id = 0;
            ctrl.model.area = "None Selected";
            ctrl.model.area_id = 0;
            ctrl.model.locality = "None Selected";
            ctrl.model.locality_id = 0;
            ctrl.stateValid = true;
            ctrl.disableSubmit = true;
          }else if(ctrl.model.state_id=='' || ctrl.model.state_id==null){
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
        let popover = this.popoverCtrl.create('SearchSelectPage', {listData, fromPage: 'city', pageId: this.model.state_id}, {cssClass: 'custom-popover'});
        popover.present({
        ev: ev
        });
        popover.onDidDismiss(data => {
          if(data!=null){
            ctrl.cityValid = true;
            ctrl.model.city=data.city_name;
            ctrl.model.city_id=data.city_id;
            ctrl.model.locality = "None Selected";
            ctrl.model.locality_id = 0;
            ctrl.disableSubmit = true;
          }
        })
      });
    }else if(ctrl.model.city_id=='' || ctrl.model.city_id==null){
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
        let popover = this.popoverCtrl.create('SearchSelectPage', {listData, fromPage: 'area', pageId: this.model.city_id}, {cssClass: 'custom-popover'});
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
    }else if(ctrl.model.area_id=='' || ctrl.model.area_id==null){
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
        let popover = this.popoverCtrl.create('SearchSelectPage', {listData, fromPage: 'locality', pageId: this.model.area_id}, {cssClass: 'custom-popover'});
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
    }else if(ctrl.model.locality_id=='' || ctrl.model.locality_id==null){
      this.disableSubmit = true;
      this.localityValid = false;
    }
  }
  getDelivery(){
      var ctrl = this; 
      this.serverService.getDelivery('')
        .subscribe( data => {
          this.deliveryData =data.deliverySlot;
          ctrl.model.delivery = this.deliveryData[0].id;
      });
  }
  liftAvailability(){
    if(!this.orderForm.form.value.orderData.lift && parseInt(this.orderForm.form.value.orderData.floor)>0){
      this.totalServiceCost = (parseInt(this.orderForm.form.value.orderData.floor) * (this.totalOrderQuantity) * this.model.floorCharge);
      this.grandTotal = this.orderInfo.grandOrderTotal + (parseInt(this.orderForm.form.value.orderData.floor) * (this.totalOrderQuantity) * this.model.floorCharge);
    }else{
      this.grandTotal = this.orderInfo.grandOrderTotal;
      this.totalServiceCost = 0;
    }
  }
  homePage(){
    this.navCtrl.setRoot("HomePage");
  }
  validateService(){
    if(this.orderForm.form.value.orderData.zipcode!='' || this.orderForm.form.value.orderData.zipcode!=null){
        this.serverService.validateZip(this.orderForm.form.value.orderData.zipcode)
        .subscribe( response => {
          if(response["status"]=='fail'){
            this.disableSubmit = false;
            this.toastCtrl.create({
                message: 'Sorry we are not servicing for this zipcode',
                duration: 2000,
                position: 'middle',
                showCloseButton: true,
                closeButtonText: 'Done',
                dismissOnPageChange: true,
                cssClass: "toast-error"
            }).present();
          }
      });
    }
  }
  confirmOrder(){
    var ctrl =this;
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you agree to proceed this order?',
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
            const loader = this.loadingCtrl.create({
              content: "Please wait..."
            });
            loader.present();

              var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({
                      "address": `${ctrl.orderForm.form.value.orderData.address} ${ctrl.model.locality}  ${ctrl.model.area} ${ctrl.model.city} ${ctrl.model.state} ${ctrl.orderForm.form.value.orderData.zipcode}`
                    }, function(results) {
                      if(results[0]!=undefined){
                        ctrl.model.latitude = results[0].geometry.location.lat();
                        ctrl.model.longitude = results[0].geometry.location.lng();
                      }else{
                        loader.dismiss();
                        let toast = ctrl.toastCtrl.create({
                            message: 'Please enter valid delivery address',
                            duration: 3000
                        });
                        toast.present();
                        return false;
                      }
                    });
                var shipping = {
                    customerID : this.model.customer_id,
                    customerName : this.orderForm.form.value.orderData.customerName,
                    contactNumber : this.orderForm.form.value.orderData.contactNumber,
                    stateId:this.model.state_id,
                    cityId:this.model.city_id,
                    areaId:this.model.area_id,
                    localityId: this.model.locality_id,
                    customerAddress: this.orderForm.form.value.orderData.address,
                    floorNumber: this.orderForm.form.value.orderData.floor,
                    latitude: this.model.latitude,
                    longitude: this.model.longitude
                }
                var orderItems = this.orderInfo.map(item => ({
                    bulk_price: item.bulk_price,
                    category_name: item.category_name,
                    dealer_price: item.dealer_price,
                    depositCost: item.depositCost,
                    depositAmt: item.deposited_amount,
                    returnQty: item.emptyCan,
                    mrp: item.mrp,
                    orderPrice: item.orderCost,
                    product_category_id: item.product_category_id,
                    productId: item.product_id,
                    product_image: item.product_image,
                    product_name: item.product_name,
                    orderQty: item.qty,
                    lineTotal: item.subtotal,
                    type: item.type
                }));
                var data = {
                  deliveryTimeSlot:this.model.delivery,
                  paymentType:'cod',
                  orderStatus:'ordered',
                  orderType: 'normal',
                  totalDepositAmount:this.totalDepositCost,
                  totalAmount: this.totalOrderCost,
                  serviceCharge:this.totalServiceCost,
                  shipping:shipping,
                  order:orderItems
                }
                ctrl.serverService.postData('/api/order', data).then((response) => {
                  loader.dismiss();
                  if(response["status"]='success'){
                    this.alertCtrl.create({
                      title: "Order Successful",
                      message: "Your order placed successfully!.",
                      buttons: [{
                        text: "Done",
                        handler: () => {
                            ctrl.storage.remove('cartData').then((data) => {
                              ctrl.navCtrl.setRoot("OrdersPage");
                            });
                        }
                      }]
                    }).present()
                  }else{
                      this.toastCtrl.create({
                          message: 'Purchase Order Failure!, Please try again or contact admin.',
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
                    loader.dismiss();
                  });
          }
        }
      ]
    });
    confirm.present();
  }

}
