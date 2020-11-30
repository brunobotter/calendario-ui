import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  @Input() title:string; 
  @Input() msg:string;
  @Input() cancelTxt:'Cancelar';
  @Input() okTxt:'Sim';


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ModalConfirmData
  ) { }




}
  export class ModalConfirmData {
    title: string;
    content: string;
    confirmButtonLabel: string;
    closeButtonLabel: string;
  
    constructor(data?) {
      if (data) {
        this.title = data.title;
        this.content = data.content;
        this.confirmButtonLabel = data.confirmButtonLabel;
        this.closeButtonLabel = data.closeButtonLabel;
      }
    }
  
  }
