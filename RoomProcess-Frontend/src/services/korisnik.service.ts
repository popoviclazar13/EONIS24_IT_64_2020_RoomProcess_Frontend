import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Korisnik } from '../models/korisnik';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class KorisnikService {
    constructor(private httpClient: HttpClient) { }

    //dodato zbog deleta posto vraca string i onda da bi on znao da je string
    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': 'text' // to da je string mu ovde govorim
      });

    BASE_URL = `${environment.apiUrl}/korisnik`;
    URL_KORISNIK_BY_Uloga = `${this.BASE_URL}/byUloga`;
    getAllKorisnik(): Observable<Korisnik[]>{
        return this.httpClient.get<Korisnik[]>(this.BASE_URL);
    }
    getKorisnikById(id:number): Observable<Korisnik>{
        return this.httpClient.get<Korisnik>(`${this.BASE_URL}/${id}`)
    }
    public addKorisnik(korisnik:Korisnik):Observable<Korisnik>{
        return this.httpClient.post<Korisnik>(`${this.BASE_URL}`, korisnik)
    }
    
    public updateKorisnik(korisnik:Korisnik):Observable<Korisnik>{
        return this.httpClient.put<Korisnik>(`${this.BASE_URL}`, korisnik)
    }
    
    public deleteKorisnik(id:number):Observable<void>{
        return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {headers: this.headers});
    }
    //Pretraga po stranom kljucu
    public getKorisnikByUloga(id:number):Observable<Korisnik[]>{
        return this.httpClient.get<Korisnik[]>(`${this.URL_KORISNIK_BY_Uloga}/${id}`);
    }
    //
}
