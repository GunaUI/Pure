import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderinfoPage } from './orderinfo';
import {
  ComponentsModule
} from "../../components/components.module";

@NgModule({
  declarations: [
    OrderinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderinfoPage),
    ComponentsModule
  ],
})
export class OrderinfoPageModule {}
