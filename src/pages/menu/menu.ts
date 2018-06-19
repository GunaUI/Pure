import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

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

  @ViewChild('content') nav: NavController;

  loggedIn : boolean;
  user : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public events: Events) {
    this.user = {};
    events.subscribe('user:loggedin', (user, time) => {
      // this.storage.ready().then(() => {
      //   this.storage.get('userLoginInfo').then((userLoginInfo)=>{
      //     if (userLoginInfo!=null){
      //       this.loggedIn = true;
      //       this.user = userLoginInfo.user;
      //     }else{
      //       this.loggedIn = false;
      //       this.user = null;
      //     }
      //   })
      // });
      this.getLoggedInfo()
    });
  }

  openPage(page) {
    if(page=='signup'){
      this.nav.setRoot('SignupPage');
    }else if(page=='login'){
      // this.navCtrl.push("LoginPage");
      this.nav.setRoot("LoginPage");
    }else if(page=='logout'){
      this.storage.remove('userLoginInfo').then(()=>{
        this.loggedIn = false;
        this.user = null;
      })
    }
    else{
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