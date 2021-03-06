import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule } from '@angular/forms';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

// import { File } from '@ionic-native/file';
// import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
// import { FileTransfer } from '@ionic-native/file-transfer';

import { MyApp } from './app.component';
import { ServerService } from "../services/server.service";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp,{tabsHideOnSubPages: true}),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // File,
    // DocumentViewer,
    // FileTransfer,
    ServerService,
    WheelSelector
  ]
})
export class AppModule {}
