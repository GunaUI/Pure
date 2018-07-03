import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchSelectPage } from './search-select';

@NgModule({
  declarations: [
    SearchSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchSelectPage),
  ],
})
export class SearchSelectPageModule {}
