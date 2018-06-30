import { Component } from '@angular/core';
import { IonicPage, Platform, AlertController, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { MenuPage } from '../menu/menu'



@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  constructor(private document: DocumentViewer, private file: File, private transfer: FileTransfer, private platform: Platform, private menuPage: MenuPage,public alertCtrl: AlertController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.menuPage.activePage='orders';
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
  deleteOrder(orderId){
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: `Do you agree to cancel ${orderId}?`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.toastCtrl.create({
              message: `Order: ${orderId} deleted successfully `,
              position: 'bottom',
              duration: 2500,
              showCloseButton: true
              }).present();
          }
        }
      ]
    });
    confirm.present();
  }
}
