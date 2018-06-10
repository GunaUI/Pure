import { NgModule } from '@angular/core';
import { ProductComponent } from './product/product.component';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [ProductComponent],
	imports: [IonicModule],
	exports: [ProductComponent]
})
export class ComponentsModule {}