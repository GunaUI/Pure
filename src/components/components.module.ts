import { NgModule } from '@angular/core';
import { ProductComponent } from './product/product.component';
import { IonicModule } from 'ionic-angular';
import { AccordionListComponent } from './accordion-list/accordion-list';
import { TimelineComponentModule } from './timeline/timeline.module';
@NgModule({
	declarations: [ProductComponent,
    AccordionListComponent],
	imports: [IonicModule],
	exports: [ProductComponent,
    AccordionListComponent,TimelineComponentModule]
})
export class ComponentsModule {}