import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavParams, Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootPage = 'HomePage';
  pages = [
	  { title: 'Home', component: 'HomePage' }
	  // { title: 'List', component: 'ListPage' }
  ];

  @ViewChild('content') nav: Nav;

  loggedIn : boolean;
  user : any;

  constructor(public navCtrl: Nav, public navParams: NavParams, public storage: Storage, public events: Events) {
    this.user = {};
    events.subscribe('user:loggedin', (user, time) => {
      this.getLoggedInfo()
    });
  }

  openPage(page) {
    if(page=='signup'){
      this.nav.setRoot('SignupPage');
    }else if(page=='login'){
      this.nav.setRoot("LoginPage");
    }else if(page=='profile'){
      this.nav.setRoot("ProfilePage");
    }
    else if(page=='orders'){
      this.nav.setRoot("OrdersPage");
    }
    else if(page=='subscription'){
      this.nav.setRoot("SubscriptionPage");
    }
    else if(page=='logout'){
      this.storage.remove('userLoginInfo').then(()=>{
        this.loggedIn = false;
        this.user = null;
      })
      this.nav.setRoot("HomePage");
    }else{
      this.nav.setRoot(page.component);
    }
  }
  ionViewDidEnter() {
    this.getLoggedInfo()
  }

  getLoggedInfo(){
    this.storage.ready().then(() => {
        this.storage.get('userLoginInfo').then((userLoginInfo)=>{
          if (userLoginInfo!=null){
            this.loggedIn = true;
            this.user = userLoginInfo.user;
          }else{
            this.loggedIn = false;
            this.user = null;
          }
        })
      });
  }

}