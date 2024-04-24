import { OBJEKAT_BY_KORISNIK, OBJEKAT_BY_TIPOBJEKTA, OBJEKAT_BY_POPUST } from './../app/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Objekat } from '../models/objekat';

@Injectable({
    providedIn: 'root'
  })
export class ObjekatService {
    constructor(private httpClient: HttpClient) { }

    //dodato zbog deleta posto vraca string i onda da bi on znao da je string
    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': 'text' // to da je string mu ovde govorim
      });

    BASE_URL = `${environment.apiUrl}/objekat`;
    OBJEKAT_BY_Grad = `${this.BASE_URL}/byGrad`;
    OBJEKAT_BY_Naziv = `${this.BASE_URL}/byNaziv`;
    OBJEKAT_BY_PriceRange = `${this.BASE_URL}/byPriceRange`;
    OBJEKAT_BY_KORISNIK = `${this.BASE_URL}/byKorisnik`;
    OBJEKAT_BY_TIPOBJEKTA = `${this.BASE_URL}/byTipObjekta`;
    OBJEKAT_BY_POPUST = `${this.BASE_URL}/byPopust`;
    getAllObjekat(): Observable<Objekat[]>{
        return this.httpClient.get<Objekat[]>(this.BASE_URL);
    }
    getObjekatById(id:number): Observable<Objekat>{
        return this.httpClient.get<Objekat>(`${this.BASE_URL}/${id}`)
    }
    public addObjekat(objekat:Objekat):Observable<Objekat>{
        return this.httpClient.post<Objekat>(`${this.BASE_URL}`, objekat)
    }
    
    public updateObjekat(objekat:Objekat):Observable<Objekat>{
        return this.httpClient.put<Objekat>(`${this.BASE_URL}`, objekat)
    }
    
    public deleteObjekat(id:number):Observable<void>{
        return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {headers: this.headers});
    }
    //Pretraga po stranom kljucu, nazivu, gradu, priceRange
    public getObjekatByGrad(grad:string):Observable<Objekat[]>{
        return this.httpClient.get<Objekat[]>(`${this.OBJEKAT_BY_Grad}/${grad}`);
    }
    public getObjekatByNaziv(naziv:string):Observable<Objekat[]>{
        return this.httpClient.get<Objekat[]>(`${this.OBJEKAT_BY_Naziv}/${naziv}`);
    }
    public getObjekatByPriceRange(cenaDonja:number, cenaGornja:number):Observable<Objekat[]>{
        return this.httpClient.get<Objekat[]>(`${this.OBJEKAT_BY_PriceRange}?cenaDonja=${cenaDonja}&cenaGornja=${cenaGornja}`);
    }
    public getObjekatByKorisnik(korisnikId:number):Observable<Objekat[]>{
        return this.httpClient.get<Objekat[]>(`${this.OBJEKAT_BY_KORISNIK}/${korisnikId}`);
    }
    public getObjekatByTipObjekta(tipObjektaId:number):Observable<Objekat[]>{
        return this.httpClient.get<Objekat[]>(`${this.OBJEKAT_BY_TIPOBJEKTA}/${tipObjektaId}`);
    }
    public getObjekatByPopust(popustId:number):Observable<Objekat[]>{
        return this.httpClient.get<Objekat[]>(`${this.OBJEKAT_BY_POPUST}/${popustId}`);
    }
    //
}
