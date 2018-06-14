import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootPage = 'HomePage';
  pages = [
	  { title: 'Home', component: 'HomePage' },
	  { title: 'List', component: 'ListPage' }
  ];

  @ViewChild('content') nav: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openPage(page) {
    if(page=='signup'){
      this.nav.setRoot('SignupPage');
    }else if(page=='login'){
      // this.navCtrl.push("LoginPage");
      this.nav.setRoot("LoginPage");
    }else{
      this.nav.setRoot(page.component);
    }
    
  }

}