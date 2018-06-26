import { Component } from '@angular/core';
import { IonicPage, Nav, NavParams, ModalController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';



@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  constructor(public navCtrl: Nav, public navParams: NavParams, public modalCtrl : ModalController, private document: DocumentViewer, private file: File, private transfer: FileTransfer, private platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }
  openInvoice(){
      const options: DocumentViewerOptions = {
        title: 'Invoice',
        documentView: { closeLabel: '' },
        navigationView: { closeLabel: '' },
        email: { enabled: true },
        print: { enabled: true },
        openWith: { enabled: true },
        bookmarks: { enabled: true },
        search: { enabled: false },
        autoClose: { onPause: false }
      }
    let path = null;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }
    const transfer = this.transfer.create();
    transfer.download('https://devdactic.com/html/5-simple-hacks-LBT.pdf', path + 'invoice.pdf').then(entry => {
      let url = entry.toURL();
      this.document.viewDocument(url, 'application/pdf', options);
    });
  }
}
