import { NgModule } from '@angular/core';
import { ProductComponent } from './product/product.component';
import { IonicModule } from 'ionic-angular';
import { AccordionListComponent } from './accordion-list/accordion-list';
@NgModule({
	declarations: [ProductComponent,
    AccordionListComponent],
	imports: [IonicModule],
	exports: [ProductComponent,
    AccordionListComponent]
})
export class ComponentsModule {}