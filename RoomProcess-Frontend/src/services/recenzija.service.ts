import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Recenzija } from '../models/recenzija';

@Injectable({
    providedIn: 'root'
  })
export class RecenzijaService {
    constructor(private httpClient: HttpClient) { }

    //dodato zbog deleta posto vraca string i onda da bi on znao da je string
    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': 'text' // to da je string mu ovde govorim
      });

    BASE_URL = `${environment.apiUrl}/recenzija`;
    RECENZIJA_BY_KORISNIK = `${this.BASE_URL}/byKorisnik`;
    RECENZIJA_BY_REZERVACIJA = `${this.BASE_URL}/byRezervacija`;
    getAllRecenzija(): Observable<Recenzija[]>{
        return this.httpClient.get<Recenzija[]>(this.BASE_URL);
    }
    getRecenzijaById(id:number): Observable<Recenzija>{
        return this.httpClient.get<Recenzija>(`${this.BASE_URL}/${id}`)
    }
    public addRecenzija(recenzija:Recenzija):Observable<Recenzija>{
        return this.httpClient.post<Recenzija>(`${this.BASE_URL}`, recenzija)
    }
    
    public updateRecenzija(recenzija:Recenzija):Observable<Recenzija>{
        return this.httpClient.put<Recenzija>(`${this.BASE_URL}`, recenzija)
    }
    
    public deleteRecenzija(id:number):Observable<void>{
        return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {headers: this.headers});
    }
    //Pretraga po stranom kljucu
    public getRecenzijaByKorisnik(korisnikId:number):Observable<Recenzija[]>{
        return this.httpClient.get<Recenzija[]>(`${this.RECENZIJA_BY_KORISNIK}/${korisnikId}`);
    }
    public getRecenzijaByRezervacija(rezervacijaId:number):Observable<Recenzija[]>{
        return this.httpClient.get<Recenzija[]>(`${this.RECENZIJA_BY_REZERVACIJA}/${rezervacijaId}`);
    }
    //
}
