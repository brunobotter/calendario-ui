import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent, AlertType, ModalAlertData } from '../modal/alert/alert.component';
import { DialogComponent, ModalConfirmData } from '../modal/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public dialog: MatDialog) { }

  getAlertTitle(alertType: AlertType) {
    switch (alertType) {
      case AlertType.INFO:
        return 'INFO';
      case AlertType.WARNING:
        return 'WARNING';
      case AlertType.ERROR:
        return 'ERROR';
    }
  }

  openAlertModal(message: string, alertType: AlertType) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '300px',
      data: new ModalAlertData({
        title: this.getAlertTitle(alertType),
        content: message,
        closeButtonLabel: 'Close',
        alertType: alertType
      })
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('After Close Modal', result);
    });
  }
 
  openInfoModal(message: string) {
    this.openAlertModal(message, AlertType.INFO);
  }

  openWarningModal(message: string) {
    this.openAlertModal(message, AlertType.WARNING);
  }

  openErrorModal(message: string) {
    this.openAlertModal(message, AlertType.ERROR);
  }

  openConfirmModal(message: string, callBackFunction: Function) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: new ModalConfirmData({
        title: 'Exclusão',
        content: message,
        confirmButtonLabel: 'Confirm',
        closeButtonLabel: 'Close'
      })
    });

    dialogRef.afterClosed().subscribe(result => callBackFunction(result));
  }

}
