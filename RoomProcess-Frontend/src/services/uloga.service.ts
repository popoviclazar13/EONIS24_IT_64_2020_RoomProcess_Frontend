import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Uloga } from '../models/uloga';

@Injectable({
    providedIn: 'root'
  })
export class UlogaService {
    constructor(private httpClient: HttpClient) { }

    //dodato zbog deleta posto vraca string i onda da bi on znao da je string
    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': 'text' // to da je string mu ovde govorim
      });

    BASE_URL = `${environment.apiUrl}/uloga`;
    getAllUloga(): Observable<Uloga[]>{
        return this.httpClient.get<Uloga[]>(this.BASE_URL);
    }
    getUlogaById(id:number): Observable<Uloga>{
        return this.httpClient.get<Uloga>(`${this.BASE_URL}/${id}`)
    }
    public addUloga(uloga:Uloga):Observable<Uloga>{
        return this.httpClient.post<Uloga>(`${this.BASE_URL}`, uloga)
    }
    
    public updateUloga(uloga:Uloga):Observable<Uloga>{
        return this.httpClient.put<Uloga>(`${this.BASE_URL}`, uloga)
    }
    
    public deleteUloga(id:number):Observable<void>{
        return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {headers: this.headers});
    }
}