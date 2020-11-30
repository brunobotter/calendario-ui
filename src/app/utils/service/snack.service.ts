import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum AlertTypes{
  DANGER = 'danger',
  SUCCESS = 'success',

}

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(private snackBar: MatSnackBar) { }

  barraSucesso(message: string, action?: string) { 
    this.snackBar.open(message, action, { 
      verticalPosition: 'top',
       duration: 2000,
       panelClass: 'sucesso'
    });   
  } 

  barraError(message: string, action?: string) { 
    this.snackBar.open(message, action, { 
      verticalPosition: 'top',
       duration: 2000,
       panelClass: 'erro'
    });   
  } 


}
 