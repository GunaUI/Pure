import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ServerService } from "../../services/server.service";

@IonicPage()
@Component({
  selector: 'page-search-select',
  templateUrl: 'search-select.html',
})
export class SearchSelectPage {

  items:any;
  state : any;
  fromPage : any;
  pageId : any;
  searchQuery: string = '';


  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,private serverService: ServerService) {
    this.items = this.navParams.get('listData');
    this.state = this.items
    this.fromPage = this.navParams.get('fromPage');
    this.pageId = this.navParams.get('pageId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchSelectPage');
  }

  dismiss(item) {
    let data = item;
    this.viewCtrl.dismiss(data);
  }

  getItems(ev: any) {
    const val = ev.target.value;
    if(this.fromPage=='state'){
      this.items = this.state;
    }else if (this.fromPage=='city'){
      this.serverService.getCityById(this.pageId,val)
      .subscribe( city => {
          this.items = city.city; 
      });
    }else if (this.fromPage=='area'){
      this.serverService.getAreaById(this.pageId,val)
      .subscribe( area => {
          this.items = area.area; 
      });
    }
    else if (this.fromPage=='locality'){
      this.serverService.getLocationById(this.pageId,val)
      .subscribe( locality => {
          this.items = locality.location; 
      });
    }
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        if(this.fromPage=='state'){
          return (item.state_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }else if(this.fromPage=='city'){
          return (item.city_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        else if(this.fromPage=='area'){
          return (item.area_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        else if(this.fromPage=='locality'){
          return (item.locality_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
      });
    }
  }

}
