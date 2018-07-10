import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  AlertController
} from 'ionic-angular';
import {
  ServerService
} from "../../services/server.service";
import {
  Storage
} from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  oneTimePwd = '';
  invalidOTP = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService, private storage: Storage, public viewCtrl: ViewController, private toastCtrl: ToastController, private alertCtrl: AlertController) {}
  submit() {
    var ctrl = this;
    this.invalidOTP = false;
    this.storage.get('registrationVerifiction').then((registrationVerifiction) => {
      if (registrationVerifiction != null && registrationVerifiction["otp"] == this.oneTimePwd) {
        ctrl.serverService.sendOTP(registrationVerifiction["customerId"], this.oneTimePwd)
          .subscribe(response => {
            if (response.status == "success") {
              this.storage.remove('registrationVerifiction').then(() => {
                this.invalidOTP = true;
                this.viewCtrl.dismiss();
                this.toastCtrl.create({
                  message: 'Your account verified successfully!!',
                  duration: 3000
                }).present();
              });
            }
          });
      } else {
        console.log(registrationVerifiction);
        this.invalidOTP = true;
      }
    })
  }

  resendOTP() {
    var ctrl = this;
    this.invalidOTP = false;
    this.storage.get('registrationVerifiction').then((registrationVerifiction) => {
      var customer = {
        customerId: registrationVerifiction["customerId"]
      }
      ctrl.serverService.resendOTP('/api/customer-otp', customer).then((response) => {
        registrationVerifiction["otp"] = response["otp"];
        this.storage.set('registrationVerifiction', registrationVerifiction).then(() => {
          this.alertCtrl.create({
            title: "OTP Resend Successfully",
            message: "OTP details sent to your registered email, Please check!.",
            buttons: [{
              text: "OK"
            }]
          }).present()
        });
      }, (err) => {
        console.log('error', err)
      });
    })
  }
}
