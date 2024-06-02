import { HttpClient, HttpHeaders, HttpBackend  } from '@angular/common/http';
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
        'responseType': 'text', // to da je string mu ovde govorim
        //'X-Skip-SSL-Check': 'true' // dodato nece da rutira, da skipa SSL private httpBackend: HttpBackend
      });

    BASE_URL = `${environment.apiUrl}/korisnik`;
    URL_KORISNIK_BY_Uloga = `${this.BASE_URL}/byUloga`;
    LOGIN_URL = `${this.BASE_URL}/Login`;
    ADMIN_URL = `${this.BASE_URL}/admin`;
    ADMIN_URL_CREATE = `${this.BASE_URL}/admin/Register`;



    getAllKorisnik(): Observable<Korisnik[]>{
        //const httpClient = new HttpClient(this.httpBackend);
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
    //Admin kad dodaje i kad azurira
    public addKorisnikAdmin(korisnik:Korisnik):Observable<Korisnik>{
        return this.httpClient.post<Korisnik>(`${this.ADMIN_URL_CREATE}`, korisnik)
    }
    
    public updateKorisnikAdmin(korisnik:Korisnik):Observable<Korisnik>{
        return this.httpClient.put<Korisnik>(`${this.ADMIN_URL}/${korisnik.korisnikId}`, korisnik)
    }
    //
    //Login
    public loginKorisnik(username: string, password: string):Observable<void>{
        console.log(username, password);
        const credentials = { username: username, password: password };
        return this.httpClient.post<void>(`${this.LOGIN_URL}`, credentials, { headers: this.headers });
    }
    //Pretraga po stranom kljucu
    public getKorisnikByUloga(id:number):Observable<Korisnik[]>{
        return this.httpClient.get<Korisnik[]>(`${this.URL_KORISNIK_BY_Uloga}/${id}`);
    }
    //
}
