import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

  private loggedIn = false;
  private userName = '';
  private role: number | null = null;

  login(userName: string, token: string, role: number): void {
    this.loggedIn = true;
    this.userName = userName;
    this.role = role;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('angular17token', token);
      localStorage.setItem('ulogaId', role.toString());
      localStorage.setItem('user', userName);
    }
  }

  logout(): void {
    this.loggedIn = false;
    this.userName = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('angular17token');
      localStorage.removeItem('ulogaId');
      localStorage.removeItem('user');
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn || (typeof window !== 'undefined' && window.localStorage.getItem('angular17token') !== null);
  }

  getUserName(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return this.userName || localStorage.getItem('user') || '';
    }
    return this.userName;
  }
  getUserRole(): number{
    if (typeof window !== 'undefined' && window.localStorage) {
      const localStorageRole = localStorage.getItem('ulogaId');
      if (localStorageRole !== null) {
        return parseInt(localStorageRole);
      }
    }
    return this.role || 0; // Ako podaci iz lokalnog skladišta nisu dostupni, vraćamo vrednost this.role ili 0 kao podrazumevanu vrednost
  }

}
