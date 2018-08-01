import { Component } from '@angular/core';
import { IonicPage, Nav } from 'ionic-angular';
import {
  ServerService
} from "../../services/server.service";
import {
  Storage
} from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  items : any 
  balance :any = {
    amount : 0,
    status : ''
  }

  // items = [
  //   {
  //     title: 'Courgette daikon',
  //     content: `Parsley amaranth tigernut silver beet maize fennel spinach. Ricebean black-eyed pea maize
  //               scallion green bean spinach cabbage jícama bell pepper carrot onion corn plantain garbanzo.
  //               Sierra leone bologi komatsuna celery peanut swiss chard silver beet squash dandelion maize
  //               chicory burdock tatsoi dulse radish wakame beetroot.`,
  //     icon: 'calendar',
  //     time: { subtitle: '4/16/2013', title: '21:30' }
  //   },
  //   {
  //     title: 'Courgette daikon',
  //     content: `Parsley amaranth tigernut silver beet maize fennel spinach. Ricebean black-eyed pea maize
  //               scallion green bean spinach cabbage jícama bell pepper carrot onion corn plantain garbanzo.
  //               Sierra leone bologi komatsuna celery peanut swiss chard silver beet squash dandelion maize
  //               chicory burdock tatsoi dulse radish wakame beetroot.`,
  //     icon: 'calendar',
  //     time: { subtitle: 'January', title: '29' }
  //   },
  //   {
  //     title: 'Courgette daikon',
  //     content: `Parsley amaranth tigernut silver beet maize fennel spinach. Ricebean black-eyed pea maize
  //               scallion green bean spinach cabbage jícama bell pepper carrot onion corn plantain garbanzo.
  //               Sierra leone bologi komatsuna celery peanut swiss chard silver beet squash dandelion maize
  //               chicory burdock tatsoi dulse radish wakame beetroot.`,
  //     icon: 'calendar',
  //     time: { title: 'Short Text' }
  //   }
  // ];

  constructor(
    public navCtrl: Nav, private serverService: ServerService, private storage: Storage
  ) { 
    this.getWalletHistory('') 
    this.getWalletBalance('');
  }

  getWalletHistory(refresher) {
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        this.serverService.getWalletHistory(userLoginInfo["customer_id"])
        .subscribe(wallet => {
          if(wallet.status='success'){
            this.items = wallet.walletDetails;
            if(refresher!=''){
                refresher.complete();
            }
          }
        });
      };
    })
  }
  getWalletBalance(refresher) {
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        this.serverService.getWalletBalance(userLoginInfo["customer_id"])
        .subscribe(wallet => {
          if(wallet.status='success'){
            this.balance.amount = wallet.walletDetails[0].amount;
            this.balance.status = wallet.walletDetails[0].wallet_status;
            if(refresher!=''){
                refresher.complete();
            }
          }
        });
      };
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimelinePage');
  }

}
