import { Component } from '@angular/core';
import { Platform ,ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'MenuPage';
  public counter=0;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public toastCtrl: ToastController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      platform.registerBackButtonAction(() => {
        if (this.counter == 0) {
          this.counter++;
          this.presentToast();
          setTimeout(() => { this.counter = 0 }, 3000)
        } else {
          // console.log("exitapp");
          platform.exitApp();
        }
      }, 0)

    });
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: "Tap again to exit",
      duration: 3000,
      position: "middle"
    });
    toast.present();
  }
}

