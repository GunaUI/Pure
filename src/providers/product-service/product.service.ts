import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PRODUCT_LIST } from '../../mocks/products.mocks'
import { Product } from '../../models/product.interface'

@Injectable()
export class ProductServiceProvider {

  constructor(public http: Http) {
    console.log('Hello ProductProvider Provider');
  }
  mockgetProduct() : Observable<Product[]> {
    return Observable.of(PRODUCT_LIST);

  }

}
