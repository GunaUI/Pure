import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { google } from "google-maps";
import { ServerService } from "../../services/server.service";

@IonicPage()
@Component({
  selector: 'page-orderinfo',
  templateUrl: 'orderinfo.html',
})
export class OrderinfoPage {
  @ViewChild('map') mapRef: ElementRef;
  google: google;
  orderData = {
    order_id:'',
    dealer_id:'',
    order_no:'',
    order_datetime:'',
    added_on:'',
    delivery_date:'',
    delivery_time_slot:'',
    delivered_on:'',
    cancelled_on:'',
    customer_id:'',
    area_id:'',
    locality_id:'',
    customer_name:'',
    customer_address:'',
    contact_number:'',
    lift_access:'',
    floor_number:'',
    payment_type:'',
    payment_status:'',
    order_type:'',
    order_or_refund_type:'',
    onetime_or_recurrence_type:'',
    order_frequency_days:'',
    ordered:'',
    total_deposit_amount:'',
    total_amount:'',
    remarks:'',
    service_charge:'',
    locality_name:'',
    area_name:'',
    city_id:'',
    city_name:'',
    state_id:'',
    state_name:'',
    orderDetails:''
  };
  grandCost : number;

  constructor(public navParams: NavParams,private serverService: ServerService,public viewCtrl: ViewController) {
    this.getOrdersInfo() 
  }
  getOrdersInfo(){
    this.serverService.getOrderById(this.navParams.get('orderId'))
        .subscribe(orderinfo => {
        const location = new google.maps.LatLng(orderinfo.order.delivery_latitude,orderinfo.order.delivery_longitude);
        const options = {
          center:location,
          zoom : 13
        }
        const map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.addMarker(location, map)
        this.grandCost = parseInt(orderinfo.order.total_amount)+parseInt(orderinfo.order.total_deposit_amount)+parseInt(orderinfo.order.service_charge);
        this.orderData = {
          order_id:orderinfo.order.order_id,
          dealer_id:orderinfo.order.dealer_id,
          order_no:orderinfo.order.order_no,
          order_datetime:orderinfo.order.order_datetime,
          added_on:orderinfo.order.added_on,
          delivery_date:orderinfo.order.delivery_date,
          delivery_time_slot:orderinfo.order.delivery_time_slot,
          delivered_on:orderinfo.order.delivered_on,
          cancelled_on:orderinfo.order.cancelled_on,
          customer_id:orderinfo.order.customer_id,
          area_id:orderinfo.order.area_id,
          locality_id:orderinfo.order.locality_id,
          customer_name:orderinfo.order.customer_name,
          customer_address:orderinfo.order.customer_address,
          contact_number:orderinfo.order.contact_number,
          lift_access:orderinfo.order.lift_access,
          floor_number:orderinfo.order.floor_number,
          // delivery_latitude:orderinfo.order.delivery_latitude,
          // delivery_longitude:orderinfo.order.delivery_longitude,
          payment_type:orderinfo.order.payment_type,
          payment_status:orderinfo.order.payment_status,
          order_type:orderinfo.order.order_type,
          order_or_refund_type:orderinfo.order.order_or_refund_type,
          onetime_or_recurrence_type:orderinfo.order.onetime_or_recurrence_type,
          order_frequency_days:orderinfo.order.order_frequency_days,
          ordered:orderinfo.order.ordered,
          total_deposit_amount:orderinfo.order.total_deposit_amount,
          total_amount:orderinfo.order.total_amount,
          remarks:orderinfo.order.remarks,
          service_charge:orderinfo.order.service_charge,
          locality_name:orderinfo.order.locality_name,
          area_name:orderinfo.order.area_name,
          city_id:orderinfo.order.city_id,
          city_name:orderinfo.order.city_name,
          state_id:orderinfo.order.state_id,
          state_name:orderinfo.order.state_name,
          orderDetails:orderinfo.order.orderDetails
        };
    });
  }

  addMarker(position, map){
    console.log(position);
    return new google.maps.Marker({
      position,
      map
    });
  }

  backToOrder(){
    this.viewCtrl.dismiss();
  }

}
