import {
  Component,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  Nav,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {

  @ViewChild('content') nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepositPage');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
