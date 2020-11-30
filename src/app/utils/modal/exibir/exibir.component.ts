import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addDays, format, isAfter, isEqual, sub, subDays } from 'date-fns';
import { AlertService } from '../../service/alert.service';
import { EventoService } from '../../service/evento.service';
import { SnackService } from '../../service/snack.service';
import { AlertType } from '../alert/alert.component';

@Component({
  selector: 'app-exibir',
  templateUrl: './exibir.component.html',
  styleUrls: ['./exibir.component.css']
})
export class ExibirComponent implements OnInit {
  eventoFormulario: FormGroup;
  alterarRegistro: boolean = true;
  constructor(private eventoService: EventoService,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExibirComponent>,
    private snack: SnackService,
    private alert: AlertService) { }

  ngOnInit(): void {
    this.carregarFormularioEmBranco();
    this.pegarDados();
  }


  carregarFormularioEmBranco(){
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

  pegarDados(){
    this.eventoService.buscaPorId(this.data.dados).subscribe(data =>{
      this.populaFormulario(data);
    });
  }

  populaFormulario(data){
    var horaInicio = format(new Date(data.start), "HH:mm");
    var horaFim = format(new Date(data.end), "HH:mm");
    var DataExibirFim = subDays(new Date(data.end),1);
    if(data.allDay == true){
    this.eventoFormulario = this.fb.group({
      title: {value: data.title , disabled: this.alterarRegistro},
      description: {value: data.description, disabled: this.alterarRegistro },
      start: {value: data.start, disabled: this.alterarRegistro },
      end: {value: DataExibirFim, disabled: this.alterarRegistro },
      startHour: {value: horaInicio, disabled: this.alterarRegistro },
      endHour: {value: horaFim, disabled: this.alterarRegistro },
      color: {value: data.color, disabled: this.alterarRegistro },
      allDay: [data.allDay,]
    });
  }else{
    this.eventoFormulario = this.fb.group({
      title: {value: data.title , disabled: this.alterarRegistro},
      description: {value: data.description, disabled: this.alterarRegistro },
      start: {value: data.start, disabled: this.alterarRegistro },
      end: {value: data.end, disabled: this.alterarRegistro },
      startHour: {value: horaInicio, disabled: this.alterarRegistro },
      endHour: {value: horaFim, disabled: this.alterarRegistro },
      color: {value: data.color, disabled: this.alterarRegistro },
      allDay: [data.allDay,]
    });
  }
  }

  fecharModal(){
    this.dialogRef.close();
    location.reload();
  }

  salvar(){
    let novaDataInicio = format(new Date(this.eventoFormulario.value.start), "yyyy-MM-dd");
    let novaDataFinal = format(new Date(this.eventoFormulario.value.end), "yyyy-MM-dd");
    let novaHoraInicio = this.eventoFormulario.value.startHour;
    let novaHoraFinal = this.eventoFormulario.value.endHour;
    
    this.eventoFormulario.value.start = format(new Date(novaDataInicio + "T" + novaHoraInicio),"yyyy-MM-dd'T'HH:mm:ss.SSSXXX") ;
    this.eventoFormulario.value.end = format(new Date(novaDataFinal + "T" + novaHoraFinal),"yyyy-MM-dd'T'HH:mm:ss.SSSXXX") ;
    var result = isAfter(new Date(this.eventoFormulario.value.start), new Date(this.eventoFormulario.value.end))
    if(result == true){
      this.alert.openAlertModal('data final nao pode ser menor que inicial', AlertType.WARNING);
    }else{
      var comparaDataInicial = format(new Date(this.eventoFormulario.value.start),"yyyy-MM-dd") ;
      var comparaDataFinal = format(new Date(this.eventoFormulario.value.end),"yyyy-MM-dd") ;
      var resultCompare = isEqual(new Date(comparaDataInicial), new Date(comparaDataFinal));
      console.log(resultCompare)
      if(resultCompare == true){
        this.eventoFormulario.value.allDay = false;
        this.eventoService.atualizar(this.eventoFormulario.value, this.data.dados).subscribe(data =>{
          this.fecharModal();
         });
      }else{
        this.eventoFormulario.value.start = format(new Date(novaDataInicio + "T"+ novaHoraInicio),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx") ;
        this.eventoFormulario.value.end = format(new Date(novaDataFinal + "T"+ novaHoraFinal),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx") ;
        this.eventoFormulario.value.end = addDays(new Date(this.eventoFormulario.value.end),1);
        this.eventoFormulario.value.allDay = true;
        this.eventoService.atualizar(this.eventoFormulario.value, this.data.dados).subscribe(data =>{
         this.fecharModal();
        });
      }
        
    this.snack.barraSucesso("Salvo com sucesso!");
  }
  }

  editar(){
    this.alterarRegistro = false;
    this.pegarDados();
  }

  deletar(){
    this.alert.openConfirmModal('Deseja realmente excluir?',(answer: boolean) =>{
      if(answer){
    this.eventoService.deletar(this.data.dados).subscribe(data =>{
      this.fecharModal();
    });
    this.snack.barraError('Deletado com sucesso!');
  }
});
}

  
}
