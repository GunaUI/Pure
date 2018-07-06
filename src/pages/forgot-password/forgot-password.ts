import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ServerService } from "../../services/server.service";

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController,private serverService: ServerService, private alertCtrl : AlertController) {
  }
  username;
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
  backToLogin(){
    this.viewCtrl.dismiss();
  }
  resetPassword(){
    this.serverService.postData('/api/password/',this.username).then((result) => {
          if(result["status"]=='success'){
                this.alertCtrl.create({
                  title : "Reset Successful",
                  message : "Account reset instruction sent to your registered email!.",
                  buttons: [{
                    text: "OK",
                    handler: () => {
                        this.navCtrl.setRoot("HomePage");  
                    }
                  }]
                }).present()
          }
        }, (err) => {
          console.log('error',err)
        });
  }

}
