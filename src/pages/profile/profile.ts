import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile : any = {};
  billing_shipping_same : boolean;

  // @ViewChild('content') nav: NavController;

  constructor(private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController, private alertCtrl: AlertController, public modalCtrl : ModalController) {
    this.profile.billing_address = {};
    this.profile.shipping_address = {};
    this.billing_shipping_same = false;
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }
  validateEmail(){

    //let validEmail=false
    let reg = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
    var patt = new RegExp(reg);
    console.log(this.profile.email);
    console.log(patt.test(this.profile.email));
    if(patt.test(this.profile.email)){

      //let validEmail=true

      this.toastCtrl.create({
        message: "Congratz, Email good to go",
        duration : 3000
      }).present();

    }else{

      this.toastCtrl.create({
        message: "Please enter valid email",
        showCloseButton: true
      }).present();

      let validEmail=false

    }

  }
  updateProfile(){
    this.alertCtrl.create({
      title : 'Profile Updated',
      message : 'Profile updated successfully!!!',
      buttons : [{
        text:'Home',
        handler: ()=>{
          this.navCtrl.setRoot("HomePage");
        }
      }]
    }).present();
  }

  openModal(){
    let modal = this.modalCtrl.create("DepositPage").present();
  }

}
