import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

let apiUrl = 'http://puredip.deforay.in';
@Injectable()
export class ServerService {
  constructor(private http: Http) {}
  // storeServers(servers: any[]) {
  //   const headers = new Headers({'Content-Type': 'application/json'});
  //   // return this.http.post('https://udemy-ng-http.firebaseio.com/data.json',
  //   //   servers,
  //   //   {headers: headers});
  //   return this.http.put('https://udemy-ng-http.firebaseio.com/data.json',
  //     servers,
  //     {headers: headers});
  // }
  // getServers() {
  //   return this.http.get('https://udemy-ng-http.firebaseio.com/data')
  //     .map(
  //       (response: Response) => {
  //         const data = response.json();
  //         for (const server of data) {
  //           server.name = 'FETCHED_' + server.name;
  //         }
  //         return data;
  //       }
  //     )
  //     .catch(
  //       (error: Response) => {
  //         return Observable.throw('Something went wrong');
  //       }
  //     );
  // }
  // getAppName() {
  //   return this.http.get('https://udemy-ng-http.firebaseio.com/appName.json')
  //     .map(
  //       (response: Response) => {
  //         return response.json();
  //       }
  //     );
  // }

  getState() {
    return this.http.get('/api/location?state=all')
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getCityById(stateId,searchString) {
    return this.http.get('/api/location?state='+stateId+'&cityStr='+searchString)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getAreaById(cityId,searchString) {
    return this.http.get('/api/location?city='+cityId+'&areaStr='+searchString)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getLocationById(areaId,searchString) {
    return this.http.get('/api/location?area='+areaId+'&locStr='+searchString)
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

      this.http.post(URL, JSON.stringify(credentials), {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  checkExistingUser(mobile) {
    return this.http.get('/api/customer/'+mobile)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getProducts() {
    return this.http.get('/api/product')
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }
  getProxyURL(){
    return this.http.get('/api/')
      .map(
        (response: Response) => {
          console.log("######",response)
          return response.json();
        }
      );
    }
  sendOTP(customerId,otp){
    return this.http.get('/api/customer-otp?customerId='+customerId+'&otp='+otp)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
    }
    resendOTP(URL,customer){
    const headers = new Headers({'Content-Type': 'application/json'});
      return new Promise((resolve, reject) => {
        this.http.post(URL, JSON.stringify(customer), {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
      });
    }

    getUser(userId) {
      return this.http.get('/api/customer?customerId='+userId)
        .map(
          (response: Response) => {
            return response.json();
          }
        );
    }
    getDelivery() {
      return this.http.get('/api/delivery-slot')
        .map(
          (response: Response) => {
            return response.json();
          }
        );
    }
}

