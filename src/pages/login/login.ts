import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavParams, ToastController,AlertController, Events, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ServerService } from "../../services/server.service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userData = {
      mobile: '',
      password:''
    };

  @ViewChild('content') nav: Nav;

  constructor(public navCtrl: Nav, public navParams: NavParams, private toastCtrl: ToastController, private storage : Storage, private alertCtrl : AlertController, public events: Events, public modalCtrl : ModalController,private serverService: ServerService) {
  
  }

  login() {
    if(this.userData.mobile=='' || this.userData.password==''){
      this.toastCtrl.create({
        message:'Please enter login credentials to proceed!',
        duration: 3000
      }).present();

    }else{
        this.serverService.postData('/api/login',this.userData).then((result) => {
          console.log(result)
          if(result["status"]=='success'){
            console.log(result["customerDetails"])
            this.storage.set('userLoginInfo',result["customerDetails"]).then((data)=>{
                this.alertCtrl.create({
                  title : "Login Successful",
                  message : "You have been logged in successfully!.",
                  buttons: [{
                    text: "OK",
                    handler: () => {
                      if(this.navParams.get('next')){
                        this.navCtrl.setRoot(this.navParams.get("next"));
                      }else{
                        this.events.publish('user:loggedin', result["customerDetails"], Date.now());
                        this.navCtrl.setRoot("HomePage");  
                      }
                    }
                  }]
                }).present()
            });
          }
        }, (err) => {
          console.log('error',err)
        });
    }
  }
  
  openPage(pageName : String){
    if(pageName=='signup'){
      this.navCtrl.push("SignupPage");
    }if(pageName=='forgot'){
      this.modalCtrl.create("ForgotPasswordPage").present();
    }
  }
  ionViewDidEnter() {
    this.storage.get('registrationVerifiction').then((registrationVerifiction)=>{
      if(registrationVerifiction!=null){
        console.log(registrationVerifiction);
        this.modalCtrl.create("OtpPage").present();
      }
    })
  }

}
