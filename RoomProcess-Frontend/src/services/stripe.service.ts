import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rezervacija } from '../models/rezervacija';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private httpClient: HttpClient) { }

  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'responseType': 'text', // to da je string mu ovde govorim
    //'X-Skip-SSL-Check': 'true' // dodato nece da rutira, da skipa SSL private httpBackend: HttpBackend
  });



  private baseUrl = 'https://localhost:7047'; // Adresa vašeg backend servera

  // Metoda koja poziva create-checkout-session na backendu
  /*public createCheckoutSession(cena: number): Observable<any> {
    const url = `${this.baseUrl}/create-checkout-session`; // Formiranje URL-a
    return this.httpClient.post<any>(url, { cena, apiKey: environment.stripeApiKey }, { headers: this.headers }); // Poziv post metode sa telom zahteva koje sadrži samo cenu
  }*/
  public createCheckoutSession(cena: number): Observable<any> {
    const url = `${this.baseUrl}/create-checkout-session?cena=${cena}`; // Dodavanje cene u URL
    return this.httpClient.post<any>(url, null, { headers: this.headers }); // Postavljanje tela zahteva na null jer se podaci sada šalju preko URL-a
  }

}
