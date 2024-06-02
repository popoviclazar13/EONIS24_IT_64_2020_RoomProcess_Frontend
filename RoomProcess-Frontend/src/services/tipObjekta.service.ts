import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { TipObjekta } from '../models/tipObjekta';

@Injectable({
    providedIn: 'root'
  })
export class TipObjektaService {
    constructor(private httpClient: HttpClient) { }

    //dodato zbog deleta posto vraca string i onda da bi on znao da je string
    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': 'text' // to da je string mu ovde govorim
      });

    BASE_URL = `${environment.apiUrl}/tipObjekta`;
    getAllTipObjekta(): Observable<TipObjekta[]>{
        return this.httpClient.get<TipObjekta[]>(this.BASE_URL);
    }
    getTipObjektaById(id:number): Observable<TipObjekta>{
        return this.httpClient.get<TipObjekta>(`${this.BASE_URL}/${id}`)
    }
    public addTipObjekta(tipObjekta:TipObjekta):Observable<TipObjekta>{
        return this.httpClient.post<TipObjekta>(`${this.BASE_URL}`, tipObjekta, { responseType: 'text' as 'json' })// mora zato sto ne prepoznaje text kao JSON
    }
    
    public updateTipObjekta(tipObjekta:TipObjekta):Observable<TipObjekta>{
        return this.httpClient.put<TipObjekta>(`${this.BASE_URL}`, tipObjekta)
    }
    
    public deleteTipObjekta(id:number):Observable<void>{
        return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {headers: this.headers});
    }
}