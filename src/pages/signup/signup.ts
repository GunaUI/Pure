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
  PopoverController
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
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  @ViewChild('signupForm') registerForm: NgForm;
  submitted = false;
  localityValid = true;
  stateValid = true;
  cityValid = true;
  areaValid = true;
  disableSubmit = true;
  registerData = {};
  google: google;
  billing = {
    state: "None Selected",
    state_id: 0,
    city: "None Selected",
    city_id: 0,
    area: "None Selected",
    area_id: 0,
    locality: "None Selected",
    locality_id: 0
  };
  constructor(private navCtrl: Nav, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private serverService: ServerService, public popoverCtrl: PopoverController, private alertCtrl: AlertController, private storage: Storage) {}
  ionViewDidEnter() {
    this.registerForm.form.patchValue({
      billingData: {
        floor: 0,
        lift: false
      }
    })
  }
  onSubmit() {
    if(this.registerForm.value.userData.phone.length==10){
    var ctrl = this;
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    setTimeout(() => {
      this.serverService.checkExistingUser(this.registerForm.value.userData.phone,'')
        .subscribe(user => {
          if (user.status != "fail") {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
              "address": `${ctrl.registerForm.value.billingData.address} ${ctrl.billing.locality}  ${ctrl.billing.area} ${ctrl.billing.city} ${ctrl.billing.state} ${ctrl.registerForm.value.billingData.zipcode}`
            }, function (results) {
              if (results[0] != undefined) {
                ctrl.registerForm.value.billingData.latitude = results[0].geometry.location.lat();
                ctrl.registerForm.value.billingData.longitude = results[0].geometry.location.lng();
                if (results[0].geometry.location.lat() && results[0].geometry.location.lng()) {
                  this.registerData = {
                    customerName: ctrl.registerForm.value.userData.firstName,
                    mobile: ctrl.registerForm.value.userData.phone,
                    password: ctrl.registerForm.value.userData.password,
                    email: ctrl.registerForm.value.userData.email,
                    address: ctrl.registerForm.value.billingData.address,
                    pincode: ctrl.registerForm.value.billingData.zipcode,
                    areaId: ctrl.billing.area_id,
                    localityId: ctrl.billing.locality_id,
                    liftAccess: ctrl.registerForm.value.billingData.lift,
                    floorNumber: ctrl.registerForm.value.billingData.floor,
                    latitude: results[0].geometry.location.lat(),
                    longitude: results[0].geometry.location.lng()
                  }
                  ctrl.serverService.postData('/api/customer', this.registerData).then((response) => {
                    if (response["pinService"]) {
                      ctrl.storage.set('registrationVerifiction', response).then((data) => {
                      ctrl.alertCtrl.create({
                        title: 'Registered Successfully!!',
                        message: 'We have sent an OTP to your registered Email. Please check',
                        buttons: [{
                            text: 'Okay',
                            handler: () => {
                              loader.dismiss();
                              ctrl.navCtrl.setRoot("LoginPage");
                            }
                          }
                        ]
                      }).present();
                      });
                    } else {
                      let toast = ctrl.toastCtrl.create({
                        message: 'Registered Successfully, We are not serving for zipcode ' + ctrl.registerForm.value.billingData.zipcode + ', We will get back to you soon. ',
                        duration: 3000,
                        showCloseButton: true,
                        closeButtonText: 'Ok',
                        dismissOnPageChange: true,
                        cssClass: "toast-success"
                      });
                      toast.present();
                      loader.dismiss();
                      ctrl.navCtrl.setRoot("HomePage");
                    }
                  }, (err) => {
                    console.log('error', err)
                    loader.dismiss();
                  });
                }
              } else {
                let toast = ctrl.toastCtrl.create({
                  message: 'Please enter valid delivery address',
                  duration: 3000,
                  showCloseButton: true,
                  closeButtonText: 'Ok',
                  dismissOnPageChange: true,
                  cssClass: "toast-warning"
                });
                toast.present();
                loader.dismiss();
              }
            });
          } else {
            const confirm = this.alertCtrl.create({
              title: 'Alreay You have account!',
              message: 'Do you want to login ?',
              buttons: [{
                  text: 'No',
                  handler: () => {
                    this.registerForm.form.patchValue({
                      userData: {
                        phone: ''
                      }
                    })
                    loader.dismiss();
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    loader.dismiss();
                    this.navCtrl.setRoot("LoginPage");
                  }
                }
              ]
            });
            confirm.present();
          }
        });
    }, 100);
    }else{
      this.toastCtrl.create({
        message: 'Please enter valid Mobile Number',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'Ok',
        dismissOnPageChange: true,
        cssClass: "toast-warning"
      }).present();
    }
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
    this.serverService.checkExistingUser(this.registerForm.value.userData.phone,'')
      .subscribe(user => {
        if (user.status == "fail") {
          const confirm = this.alertCtrl.create({
            title: 'Alreay You have account!',
            message: 'Do you want to login ?',
            buttons: [{
                text: 'No',
                handler: () => {
                  this.registerForm.form.patchValue({
                    userData: {
                      phone: ''
                    }
                  })
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.navCtrl.setRoot("LoginPage");
                }
              }
            ]
          });
          confirm.present();
        }
      });
  }
}
