import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  ViewController,
  AlertController
} from 'ionic-angular';
import {
  ServerService
} from "../../services/server.service";
@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private serverService: ServerService, private alertCtrl: AlertController) {}
  username;
  backToLogin() {
    this.viewCtrl.dismiss();
  }
  resetPassword() {
    this.serverService.forgotPassword(this.username)
      .subscribe(result => {
        if (result["status"] == 'success') {
          this.alertCtrl.create({
            title: "Reset Successful",
            message: "Account reset instruction sent to your registered email!.",
            buttons: [{
              text: "OK",
              handler: () => {
                this.navCtrl.setRoot("HomePage");
              }
            }]
          }).present()
        }
      });
  }

}
