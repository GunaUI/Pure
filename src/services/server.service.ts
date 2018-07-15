import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Observable';
import { SERVER_URL } from './constants';

@Injectable()

export class ServerService {
  constructor(private http: Http) {
  }
  getState() {
    return this.http.get(SERVER_URL+'/api/location?state=all')
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getCityById(stateId,searchString) {
    return this.http.get(SERVER_URL+'/api/location?state='+stateId+'&cityStr='+searchString)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getAreaById(cityId,searchString) {
    return this.http.get(SERVER_URL+'/api/location?city='+cityId+'&areaStr='+searchString)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getLocationById(areaId,searchString) {
    return this.http.get(SERVER_URL+'/api/location?area='+areaId+'&locStr='+searchString)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  postData(URL,credentials) {
    const headers = new Headers({'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      // let headers = new Headers();

      this.http.post(SERVER_URL+URL, JSON.stringify(credentials), {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  checkExistingUser(mobile,customerId) {
    if(customerId!=''){
      return this.http.get(SERVER_URL+'/api/customer?customerId='+customerId+'&mobileNo='+mobile)
      .map(
        (response: Response) => {
          return response.json();
        }
      );

    }else{
        return this.http.get(SERVER_URL+'/api/customer/'+mobile)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
    }
  }
  getProducts() {
    return this.http.get(SERVER_URL+'/api/product')
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  forgotPassword(username) {
    return this.http.get(SERVER_URL+'/api/password/'+username)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getProxyURL(){
    return this.http.get('/puredip')
      .map(
        (response: Response) => {
          console.log("######",response)
          return response.json();
        }
      );
    }
  sendOTP(customerId,otp){
    return this.http.get(SERVER_URL+'/api/customer-otp?customerId='+customerId+'&otp='+otp)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
    }
    resendOTP(URL,customer){
    const headers = new Headers({'Content-Type': 'application/json'});
      return new Promise((resolve, reject) => {
        this.http.post(SERVER_URL+URL, JSON.stringify(customer), {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
      });
    }

    getUser(userId) {
      return this.http.get(SERVER_URL+'/api/customer?customerId='+userId)
        .map(
          (response: Response) => {
            return response.json();
          }
        );
    }
    getDelivery(flag) {
      return this.http.get(SERVER_URL+'/api/delivery-slot'+flag)
        .map(
          (response: Response) => {
            return response.json();
          }
        );
    }
    validateZip(zipcode) {
      return this.http.get(SERVER_URL+'/api/location/'+zipcode)
        .map(
          (response: Response) => {
            return response.json();
          }
        );
    }
    getAllOrders(customerId){
      return this.http.get(SERVER_URL+'/api/order?customerId='+customerId)
        .map(
          (response: Response) => {
            return response.json();
          }
        );
    }
    getOrderById(orderId){
      return this.http.get(SERVER_URL+'/api/order/'+orderId)
        .map(
          (response: Response) => {
            return response.json();
          }
        );
    }
    getRecurringOrder(customerId){
      return this.http.get(SERVER_URL+'/api/recurrence-order?customerId='+customerId)
        .map(
          (response: Response) => {
            return response.json();
          }
        );
    }
    getConfig() {
    return this.http.get(SERVER_URL+'/api/config')
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
}

