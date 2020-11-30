import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import allLocales from '@fullcalendar/core/locales-all';

import interactionPlugin, { Draggable, EventDropArg } from '@fullcalendar/interaction';
import { addDays, format } from 'date-fns';
import { EventoService } from 'src/app/utils/service/evento.service';
import { AdicionarComponent } from 'src/app/utils/modal/adicionar/adicionar.component';
import { ExibirComponent } from 'src/app/utils/modal/exibir/exibir.component';
import { SnackService } from 'src/app/utils/service/snack.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  constructor(
    private eventoService: EventoService,
    public dialog: MatDialog,
    private snack: SnackService) { }

    eventos:any;
    @ViewChild('external') external: ElementRef;
    options: any;

    ngOnInit(): void {
      this.eventoService.listaTodos().subscribe(data =>{
        this.eventos = data;
        this.options = {
          timeZone: 'Brazil/East',
         locales: allLocales,
          locale: 'pt-BR',
          
          headerToolbar: {
            
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          
          
          initialView: 'dayGridMonth',
          plugins: [ interactionPlugin ],
          editable: true,
          droppable: true,
          selectable: true,
          events: this.eventos,
          eventResize: this.eventResize.bind(this),
          eventDrop: this.eventDrop.bind(this),
          dateClick: this.handleDateClick.bind(this), 
          eventClick: this.handleEventClick.bind(this)
        };
      });
 
    }

  
    handleDateClick(arg) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = false;
      dialogConfig.width = "50%";
      dialogConfig.data = {arg};
      this.dialog.open(AdicionarComponent, dialogConfig).afterClosed().subscribe(res => {
      });
    }
  
    handleEventClick(arg){
      const dialogConfig = new MatDialogConfig();
      let dados = arg.event._def.publicId;
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = false;
      dialogConfig.width = "50%";
      dialogConfig.data = {dados};
      this.dialog.open(ExibirComponent, dialogConfig).afterClosed().subscribe(res => {
      });
    }

    eventDrop(eventDrop: EventDropArg) {
      var idEvento = parseInt(eventDrop.event._def.publicId);
      var eventoStartData = format(new Date(eventDrop.event._instance.range.start), "yyyy-MM-dd") ;
      var eventoEndData = format(new Date(eventDrop.event._instance.range.end), "yyyy-MM-dd");
      this.eventoService.buscaPorId(idEvento).subscribe(data =>{
      
        if(data.allDay == true){
          var dadosEvento = data;
          var eventoStartHour =  format(new Date(data.start), "HH:mm:ss.SSSxxx");
          var eventoEndtHour =  format(new Date(data.end), "HH:mm:ss.SSSxxx");
          dadosEvento.start = addDays(new Date(eventoStartData + 'T' + eventoStartHour),1);
          dadosEvento.end = addDays(new Date(eventoEndData + 'T' + eventoEndtHour),1);
          this.eventoService.atualizar(dadosEvento, idEvento).subscribe(dados =>{
            location.reload()
           });
        }else{
          var dadosEvento = data;
          var eventoStartHour =  format(new Date(data.start), "HH:mm:ss.SSSxxx");
          var eventoEndtHour =  format(new Date(data.end), "HH:mm:ss.SSSxxx");
          dadosEvento.start = eventoStartData + 'T' + eventoStartHour;
          dadosEvento.end = eventoEndData + 'T' + eventoEndtHour;
          this.eventoService.atualizar(dadosEvento, idEvento).subscribe(dados =>{
            location.reload()
           });
        }
      
        this.snack.barraSucesso('Atualizado com sucesso!');

      });
    }
  
    
    eventResize(resize){
      var idEvento = parseInt(resize.event._def.publicId);
      var eventoStart = format(new Date(resize.event._instance.range.start), "yyyy-MM-dd");
      var eventoEnd = format(new Date(resize.event._instance.range.end), "yyyy-MM-dd");
      this.eventoService.buscaPorId(idEvento).subscribe(data =>{
        var dadosEvento = data;
        var eventoStartHora = format(new Date(dadosEvento.start), "HH:mm:ss.SSSxxx");
        var eventoEndHora = format(new Date(dadosEvento.end), "HH:mm:ss.SSSxxx");
        dadosEvento.start = format(new Date(eventoStart + 'T' + eventoStartHora), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        dadosEvento.end = format(new Date(eventoEnd + 'T' + eventoEndHora), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        dadosEvento.start = addDays(new Date(dadosEvento.start),1);
        dadosEvento.end = addDays(new Date(dadosEvento.end),1);
        console.log('resize')
        this.eventoService.atualizar(dadosEvento, idEvento).subscribe(dados =>{
          location.reload();
        });
        this.snack.barraSucesso('Atualizado com sucesso!');

      });
    }
    
}
