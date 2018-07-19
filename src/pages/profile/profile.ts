import {
  Component,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  Nav,
  ToastController,
  AlertController,
  LoadingController,
  PopoverController,
  ModalController
} from 'ionic-angular';
import {
  NgForm
} from '@angular/forms';
import {
  ServerService
} from "../../services/server.service";
import {
  google
} from "google-maps";
import {
  Storage
} from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  @ViewChild('updateProfileForm') updateProfileForm: NgForm;
  google: google;
  submitted = false;
  localityValid = true;
  stateValid = true;
  cityValid = true;
  areaValid = true;
  disableSubmit = true;
  registerData = {};
  billing = {
    state: 'None selected',
    state_id: 0,
    city: 'None selected',
    city_id: 0,
    area: 'None selected',
    area_id: 0,
    locality: 'None selected',
    locality_id: 0,
    customer_id:0
  };
  constructor(private navCtrl: Nav, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private serverService: ServerService, public popoverCtrl: PopoverController, public modalCtrl: ModalController, private alertCtrl: AlertController, private storage: Storage) {}
  ionViewDidEnter() {
    this.storage.get('userLoginInfo').then((userLoginInfo) => {
      if (userLoginInfo != null) {
        var ctrl = this;
        this.serverService.getUser(userLoginInfo["customer_id"])
          .subscribe(user => {
            ctrl.updateProfileForm.form.patchValue({
              userData: {
                firstName: user["customer"]["customer_name"],
                lastName: '',
                email: user["customer"]["email"],
                phone: user["customer"]["mobile"]
              },
              billingData: {
                address: user["customer"]["address"],
                floor: user["customer"]["floor_number"],
                lift: user["customer"]["lift_access"],
                state: user["customer"]["state_name"],
                state_id: user["customer"]["state_id"],
                city: user["customer"]["city_name"],
                city_id: user["customer"]["city_id"],
                // landmark:  user["landmark"],
                area: user["customer"]["area_name"],
                area_id: user["customer"]["area_id"],
                locality: user["customer"]["locality_name"],
                locality_id: user["customer"]["locality_id"],
                zipcode: user["customer"]["pincode"]
              }
            });
            if(user["customer"]["state_id"]!=0 && user["customer"]["city_id"]!=0 && user["customer"]["area_id"]!=0 && user["customer"]["locality_id"]!=0){
              this.disableSubmit = false;
            }
            ctrl.billing = {
                state: user["customer"]["state_name"],
                state_id: user["customer"]["state_id"],
                city: user["customer"]["city_name"],
                city_id: user["customer"]["city_id"],
                area: user["customer"]["area_name"],
                area_id: user["customer"]["area_id"],
                locality: user["customer"]["locality_name"],
                locality_id: user["customer"]["locality_id"],
                customer_id: userLoginInfo["customer_id"]
              };

          });
      } else {
        console.log('test');
      }
    })
  }
  updateProfile() {
    var ctrl = this;
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    setTimeout(() => {
      this.serverService.checkExistingUser(this.updateProfileForm.value.userData.phone,ctrl.billing.customer_id)
        .subscribe(user => {
          if (user.status != "fail") {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
              "address": `${ctrl.updateProfileForm.value.billingData.address} ${ctrl.billing.locality}  ${ctrl.billing.area} ${ctrl.billing.city} ${ctrl.billing.state} ${ctrl.updateProfileForm.value.billingData.zipcode}`
            }, function (results) {
              if (results[0] != undefined) {
                ctrl.updateProfileForm.value.billingData.latitude = results[0].geometry.location.lat();
                ctrl.updateProfileForm.value.billingData.longitude = results[0].geometry.location.lng();
                if (results[0].geometry.location.lat() && results[0].geometry.location.lng()) {
                  this.registerData = {
                    customerName: ctrl.updateProfileForm.value.userData.firstName,
                    mobile: ctrl.updateProfileForm.value.userData.phone,
                    password: ctrl.updateProfileForm.value.userData.password,
                    email: ctrl.updateProfileForm.value.userData.email,
                    address: ctrl.updateProfileForm.value.billingData.address,
                    pincode: ctrl.updateProfileForm.value.billingData.zipcode,
                    areaId: ctrl.billing.area_id,
                    localityId: ctrl.billing.locality_id,
                    liftAccess: ctrl.updateProfileForm.value.billingData.lift,
                    floorNumber: ctrl.updateProfileForm.value.billingData.floor,
                    latitude: results[0].geometry.location.lat(),
                    longitude: results[0].geometry.location.lng(),
                    customerId:ctrl.billing.customer_id,
                  }
                  ctrl.serverService.postData('/api/customer', this.registerData).then((response) => {
                    if (response["pinService"]) {
                      loader.dismiss();
                      let toast = ctrl.toastCtrl.create({
                        message: 'Your details updated Successfully',
                        duration: 3000
                      });
                      toast.present();
                      loader.dismiss();
                    } else {
                      let toast = ctrl.toastCtrl.create({
                        message: 'We are not serving for zipcode ' + ctrl.updateProfileForm.value.billingData.zipcode + ', We will get back to you soon. ',
                        duration: 3000
                      });
                      toast.present();
                      loader.dismiss();
                    }
                  }, (err) => {
                    console.log('error', err)
                    loader.dismiss();
                  });
                }
              } else {
                let toast = ctrl.toastCtrl.create({
                  message: 'Please enter valid delivery address',
                  duration: 3000
                });
                toast.present();
                loader.dismiss();
              }
            });
          } else {
            const confirm = this.alertCtrl.create({
              title: 'Exising Mobile Number',
              message: "You can't update to this number, its already mapped to another user",
              buttons: [{
                  text: 'Ok',
                  handler: () => {
                    this.updateProfileForm.form.patchValue({
                      userData: {
                        phone: ''
                      }
                    })
                  }
                }
              ]
            });
            confirm.present();
          }
        });
    }, 100);
  }
  getState(ev) {
    var ctrl = this;
    this.serverService.getState()
      .subscribe(states => {
        let listData = states.state
        let popover = this.popoverCtrl.create('SearchSelectPage', {
          listData,
          fromPage: 'state'
        }, {cssClass: 'custom-popover'});
        popover.present({
          ev: ev
        });
        popover.onDidDismiss(data => {
          if (data != null && data.state_id != 0) {
            ctrl.billing.state = data.state_name;
            ctrl.billing.state_id = data.state_id;
            ctrl.billing.city = "None Selected";
            ctrl.billing.city_id = 0;
            ctrl.billing.area = "None Selected";
            ctrl.billing.area_id = 0;
            ctrl.billing.locality = "None Selected";
            ctrl.billing.locality_id = 0;
            ctrl.stateValid = true;
            ctrl.disableSubmit = true;
          } else {
            ctrl.stateValid = false;
            ctrl.disableSubmit = true;
          }
        })
      });
  }
  getCity(ev) {
    if (this.billing.state_id != 0 && this.billing.state_id != null) {
      var ctrl = this;
      this.serverService.getCityById(this.billing.state_id, '')
        .subscribe(city => {
          let listData = city.city
          let popover = this.popoverCtrl.create('SearchSelectPage', {
            listData,
            fromPage: 'city',
            pageId: this.billing.state_id
          }, {cssClass: 'custom-popover'});
          popover.present({
            ev: ev
          });
          popover.onDidDismiss(data => {
            if (data != null) {
              ctrl.cityValid = true;
              ctrl.billing.city = data.city_name;
              ctrl.billing.city_id = data.city_id;
              ctrl.billing.area = "None Selected";
              ctrl.billing.area_id = 0;
              ctrl.billing.locality = "None Selected";
              ctrl.billing.locality_id = 0;
              ctrl.disableSubmit = true;
            }
          })
        });
    } else {
      this.cityValid = false;
      this.disableSubmit = true;
    }
  }
  getArea(ev) {
    if (this.billing.city_id != 0 && this.billing.city_id != null) {
      var ctrl = this;
      this.serverService.getAreaById(this.billing.city_id, '')
        .subscribe(area => {
          let listData = area.area
          let popover = this.popoverCtrl.create('SearchSelectPage', {
            listData,
            fromPage: 'area',
            pageId: this.billing.city_id
          }, {cssClass: 'custom-popover'});
          popover.present({
            ev: ev
          });
          popover.onDidDismiss(data => {
            if (data != null) {
              ctrl.areaValid = true;
              ctrl.billing.area = data.area_name;
              ctrl.billing.area_id = data.area_id;
               ctrl.billing.locality = "None Selected";
              ctrl.billing.locality_id = 0;
              ctrl.disableSubmit = true;
            }
          })
        });
    } else {
      this.areaValid = false;
      this.disableSubmit = true;
    }
  }
  getLocality(ev) {
    // this.disableSubmit = true;
    if (this.billing.area_id != 0 && this.billing.area_id != null) {
      var ctrl = this;
      this.serverService.getLocationById(this.billing.area_id, '')
        .subscribe(locality => {
          let listData = locality.location
          let popover = this.popoverCtrl.create('SearchSelectPage', {
            listData,
            fromPage: 'locality',
            pageId: this.billing.area_id
          }, {cssClass: 'custom-popover'});
          popover.present({
            ev: ev
          });
          popover.onDidDismiss(data => {
            if (data != null) {
              ctrl.localityValid = true;
              ctrl.disableSubmit = false;
              ctrl.billing.locality = data.locality_name;
              ctrl.billing.locality_id = data.locality_id;
            }
          })
        });
    } else {
      this.disableSubmit = true;
      this.localityValid = false;
    }
  }
  checkExistingUser() {
    this.serverService.checkExistingUser(this.updateProfileForm.value.userData.phone,this.billing.customer_id)
      .subscribe(user => {
        if (user.status == "fail") {
          const confirm = this.alertCtrl.create({
            title: 'Exising Mobile Number',
            message: "You can't update to this number, its already mapped to another user",
            buttons: [{
                text: 'Ok',
                handler: () => {
                  this.updateProfileForm.form.patchValue({
                    userData: {
                      phone: ''
                    }
                  })
                }
              }
            ]
          });
          confirm.present();
        }
      });
  }
  openModal() {
    this.modalCtrl.create("DepositPage").present();
  }

}
