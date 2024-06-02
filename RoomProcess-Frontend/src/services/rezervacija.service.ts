import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Rezervacija } from '../models/rezervacija';

@Injectable({
    providedIn: 'root'
  })
export class RezervacijaService {
    constructor(private httpClient: HttpClient) { }

    //dodato zbog deleta posto vraca string i onda da bi on znao da je string
    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': 'text' // to da je string mu ovde govorim
      });

    BASE_URL = `${environment.apiUrl}/rezervacija`;
    REZERVACIJA_BY_KORISNIK = `${this.BASE_URL}/byKorisnik`;
    REZERVACIJA_BY_OBJEKAT = `${this.BASE_URL}/byObjekat`;
    getAllRezervacija(): Observable<Rezervacija[]>{
        return this.httpClient.get<Rezervacija[]>(this.BASE_URL);
    }
    getRezervacijaById(id:number): Observable<Rezervacija>{
        return this.httpClient.get<Rezervacija>(`${this.BASE_URL}/${id}`)
    }
    public addRezervacija(rezervacija:Rezervacija):Observable<Rezervacija>{
        return this.httpClient.post<Rezervacija>(`${this.BASE_URL}`, rezervacija, { responseType: 'text' as 'json' })// mora zato sto ne prepoznaje text kao JSON
    }
    
    public updateRezervacija(rezervacija:Rezervacija):Observable<Rezervacija>{
        return this.httpClient.put<Rezervacija>(`${this.BASE_URL}`, rezervacija)
    }
    
    public deleteRezervacija(id:number):Observable<void>{
        return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {headers: this.headers});
    }
    //Pretraga po stranom kljucu
    public getRezervacijaByKorisnik(korisnikId:number):Observable<Rezervacija[]>{
        return this.httpClient.get<Rezervacija[]>(`${this.REZERVACIJA_BY_KORISNIK}/${korisnikId}`);
    }
    public getRezervacijaByObjekat(objekatId:number):Observable<Rezervacija[]>{
        return this.httpClient.get<Rezervacija[]>(`${this.REZERVACIJA_BY_OBJEKAT}/${objekatId}`);
    }
    //
}
