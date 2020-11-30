import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { addDays, format, isAfter, isEqual } from 'date-fns';
import { AlertService } from '../../service/alert.service';
import { EventoService } from '../../service/evento.service';
import { SnackService } from '../../service/snack.service';
import { AlertType } from '../alert/alert.component';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.css']
})
export class AdicionarComponent implements OnInit {
eventoFormulario: FormGroup;
  constructor(private eventoService: EventoService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdicionarComponent>,
    private snack: SnackService,
    private alert: AlertService
    ) { }

  ngOnInit(): void {
    this.carregarFormulario();
  }

  carregarFormulario(){
    this.eventoFormulario = this.fb.group({
      title: [null],
      description: [null],
      start: [null],
      end: [null],
      startHour: [null],
      endHour: [null],
      color: [null],
      allDay: [true]
    });
  }

  salvar(){
    let novaDataInicio = format(new Date(this.eventoFormulario.value.start), "yyyy-MM-dd");
    let novaDataFinal = format(new Date(this.eventoFormulario.value.end), "yyyy-MM-dd");
    let novaHoraInicio = this.eventoFormulario.value.startHour;
    let novaHoraFinal = this.eventoFormulario.value.endHour;
    
    this.eventoFormulario.value.start = format(new Date(novaDataInicio + "T" + novaHoraInicio),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx") ;
    this.eventoFormulario.value.end = format(new Date(novaDataFinal + "T" + novaHoraFinal),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx") ;

    var result = isAfter(new Date(this.eventoFormulario.value.start), new Date(this.eventoFormulario.value.end))
    if(result == true){
      this.alert.openAlertModal('data final nao pode ser menor que inicial', AlertType.WARNING);
    }else{
      var comparaDataInicial = format(new Date(this.eventoFormulario.value.start),"yyyy-MM-dd") ;
      var comparaDataFinal = format(new Date(this.eventoFormulario.value.end),"yyyy-MM-dd") ;
      var resultCompare = isEqual(new Date(comparaDataInicial), new Date(comparaDataFinal));
      if(resultCompare == true){
        this.eventoFormulario.value.allDay = false;
        this.eventoService.adicionar(this.eventoFormulario.value).subscribe(data =>{
          this.fecharModal();
         });
      }else{
        this.eventoFormulario.value.start = format(new Date(novaDataInicio + "T"+ novaHoraInicio),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx") ;
        this.eventoFormulario.value.end = format(new Date(novaDataFinal + "T"+ novaHoraFinal),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx") ;
        this.eventoFormulario.value.end = addDays(new Date(this.eventoFormulario.value.end),1);
        this.eventoFormulario.value.allDay = true;
        this.eventoService.adicionar(this.eventoFormulario.value).subscribe(data =>{
         this.fecharModal();
        });
      }
        
    this.snack.barraSucesso("Salvo com sucesso!");
  }
  }

  fecharModal(){
    this.dialogRef.close();
    location.reload();  
  }

}
