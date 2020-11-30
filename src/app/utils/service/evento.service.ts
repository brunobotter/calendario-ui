import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../model/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
url = 'http://localhost:8080/api/evento';

httpOption = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

  constructor(private http: HttpClient) { }

  public listaTodos(): Observable<any>{
   return this.http.get(this.url);
  }

  public buscaPorId(id): Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }

  public adicionar(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.url, evento, this.httpOption)
  }

  public atualizar(evento: Evento, id: number):Observable<Evento>{
    return this.http.put<Evento>(`${this.url}/${id}`, evento, this.httpOption);
  }

  public deletar(id: number):Observable<Evento>{
    return this.http.delete<Evento>(`${this.url}/${id}`);
  }

}
