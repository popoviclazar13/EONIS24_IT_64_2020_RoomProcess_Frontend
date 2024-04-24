import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Oprema } from '../models/oprema';

@Injectable({
    providedIn: 'root'
  })
export class OpremaService {
    constructor(private httpClient: HttpClient) { }

    //dodato zbog deleta posto vraca string i onda da bi on znao da je string
    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': 'text' // to da je string mu ovde govorim
      });

    BASE_URL = `${environment.apiUrl}/oprema`;
    OPREMA_BY_OBJEKAT = `${this.BASE_URL}/byObjekat`;
    getAllOprema(): Observable<Oprema[]>{
        return this.httpClient.get<Oprema[]>(this.BASE_URL);
    }
    getOpremaById(id:number): Observable<Oprema>{
        return this.httpClient.get<Oprema>(`${this.BASE_URL}/${id}`)
    }
    public addOprema(oprema:Oprema):Observable<Oprema>{
        return this.httpClient.post<Oprema>(`${this.BASE_URL}`, oprema)
    }
    
    public updateOprema(oprema:Oprema):Observable<Oprema>{
        return this.httpClient.put<Oprema>(`${this.BASE_URL}`, oprema)
    }
    
    public deleteOprema(id:number):Observable<void>{
        return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {headers: this.headers});
    }
    //Pretraga po stranom kljucu
    public getOpremaByObjekat(objekatId:number):Observable<Oprema[]>{
        return this.httpClient.get<Oprema[]>(`${this.OPREMA_BY_OBJEKAT}/${objekatId}`);
    }
    //
}
