import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Popust } from '../models/popust';

@Injectable({
    providedIn: 'root'
  })
export class PopustService {
    constructor(private httpClient: HttpClient) { }

    //dodato zbog deleta posto vraca string i onda da bi on znao da je string
    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': 'text' // to da je string mu ovde govorim
      });

    BASE_URL = `${environment.apiUrl}/popust`;
    getAllPopust(): Observable<Popust[]>{
        return this.httpClient.get<Popust[]>(this.BASE_URL);
    }
    getPopustById(id:number): Observable<Popust>{
        return this.httpClient.get<Popust>(`${this.BASE_URL}/${id}`)
    }
    public addPopust(popust:Popust):Observable<Popust>{
        return this.httpClient.post<Popust>(`${this.BASE_URL}`, popust)
    }
    
    public updatePopust(popust:Popust):Observable<Popust>{
        return this.httpClient.put<Popust>(`${this.BASE_URL}`, popust)
    }
    
    public deletePopust(id:number):Observable<void>{
        return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {headers: this.headers});
    }
}
