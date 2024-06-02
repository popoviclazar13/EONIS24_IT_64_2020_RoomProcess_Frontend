import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashbord',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './admin-dashbord.component.html',
  styleUrl: './admin-dashbord.component.css'
})
export class AdminDashbordComponent implements OnInit {

  isAdmin: boolean = false; // Dodajte promenljivu za proveru admina

  constructor(private http: HttpClient,
    private authService: AuthServiceService, // Inject AuthService
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.checkAdminRole(); // Pozovite funkciju za proveru admina prilikom inicijalizacije komponente
  }

  // Funkcija za proveru admina
  checkAdminRole(): void {
    // Pozovite servis AuthServiceService da dobijete ulogu korisnika
    const role = this.authService.getUserRole();

    // Proverite da li je uloga admin
    if (role === 1) {
      this.isAdmin = true; // Postavite isAdmin na true ako je korisnik admin
    }
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/home');
  }

}
