import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavParams, ToastController,AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username : String;
  password : String;

  @ViewChild('content') nav: Nav;

  constructor(public navCtrl: Nav, public navParams: NavParams, private toastCtrl: ToastController, private storage : Storage, private alertCtrl : AlertController, public events: Events) {
    this.username = '';
    this.password = '';
  }

  login() {
    if(this.username!='admin@deforay.com' ||this.password!='123'){
      this.toastCtrl.create({
        message:'Invalid username and/or password!',
        duration: 3000
      }).present()

    }else{
      let response = {'user':{'name':'Admin'}};
      this.storage.set('userLoginInfo',response).then((data)=>{
        this.alertCtrl.create({
          title : "Login Successful",
          message : "You have been logged in successfully!.",
          buttons: [{
            text: "OK",
            handler: () => {
              if(this.navParams.get('next')){
                this.navCtrl.setRoot(this.navParams.get("next"));
              }else{
                this.events.publish('user:loggedin', response, Date.now());
                this.navCtrl.setRoot("HomePage");  
              }
            }
          }]
        }).present()
      });
    }
  }
  
  openPage(pageName : String){
    if(pageName=='signup'){
      this.navCtrl.push("SignupPage");
    }
  }

}
