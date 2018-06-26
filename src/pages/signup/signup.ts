import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams, ToastController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser : any = {};
  billing_shipping_same : boolean;

  // @ViewChild('content') nav: NavController;

  constructor(private navCtrl: Nav, private navParams: NavParams, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false;
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }
  validateEmail(){

    //let validEmail=false
    let reg = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
    var patt = new RegExp(reg);
    console.log(this.newUser.email);
    console.log(patt.test(this.newUser.email));
    if(patt.test(this.newUser.email)){

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
  signup(){
    console.log('signup');
    this.alertCtrl.create({
      title : 'Account Created',
      message : 'Dummy account creation done, Please login with username admin, Pwd 123',
      buttons : [{
        text:'Login',
        handler: ()=>{
          this.navCtrl.setRoot("LoginPage");
        }
      }]
    }).present();
  }

}
