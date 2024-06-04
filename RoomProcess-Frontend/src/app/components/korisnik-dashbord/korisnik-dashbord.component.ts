import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { AuthServiceService } from '../../../services/auth-service.service';
import { Router } from '@angular/router';
import { Korisnik } from '../../../models/korisnik';
import { KorisnikService } from '../../../services/korisnik.service';
import { Subscription } from 'rxjs';
import { RezervacijaService } from '../../../services/rezervacija.service';
import { Recenzija } from '../../../models/recenzija';
import { Rezervacija } from '../../../models/rezervacija';
import { ObjekatService } from '../../../services/objekat.service';
import { RecenzijaService } from '../../../services/recenzija.service';
import { MatDialog } from '@angular/material/dialog';
import { Recenzija2DialogComponent } from '../dialogs/recenzija2-dialog/recenzija2-dialog.component';

@Component({
  selector: 'app-korisnik-dashbord',
  standalone: true,
  imports: [
    FormsModule, CommonModule, MatIconModule
  ],
  templateUrl: './korisnik-dashbord.component.html',
  styleUrl: './korisnik-dashbord.component.css'
})
export class KorisnikDashbordComponent implements OnInit {
  userName: string = '';
  korisnik: Korisnik = new Korisnik();
  subscription!: Subscription;
  recenzije: Recenzija[] = [];
  rezervacije: Rezervacija[] = [];

  objekatMap: Map<number, string> = new Map();

  constructor(private authService: AuthServiceService,
              private router: Router,
              private korisnikService: KorisnikService,
              private rezervacijaService: RezervacijaService,
              private recenzijaService: RecenzijaService,
              private objekatService: ObjekatService,
              public dialog: MatDialog // Uvezite MatDialog servis
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.loadUser();
    this.loadRezervacijeKorisnika();
    this.loadRecenzijaKorisnika();
    this.loadMappings();
  }

  loadUser(): void{
    this.subscription = this.korisnikService.getKorisnikById(this.authService.getUserId()).subscribe(
      (data) => {
        this.korisnik = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
    console.log(this.korisnik);
  }
  loadRezervacijeKorisnika(): void{
    this.subscription = this.rezervacijaService.getRezervacijaByKorisnik(this.authService.getUserId()).subscribe(
      (data) => {
        this.rezervacije = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
    console.log(this.rezervacije);
  }
  loadRecenzijaKorisnika(): void{
    this.subscription = this.recenzijaService.getRecenzijaByKorisnik(this.authService.getUserId()).subscribe(
      (data) => {
        this.recenzije = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  private loadMappings(): void {
    // Pretpostavka je da ovi servisi postoje i vraćaju Observable sa mapom ili listom
    this.objekatService.getAllObjekat().subscribe(data => {
      data.forEach((objekat: any) => {
        this.objekatMap.set(objekat.objekatId, objekat.objekatNaziv);
      });
    });
    console.log(this.objekatMap);
  }

  findObjekat(objekatId: number){
    return this.objekatMap.get(objekatId) || 'Nepoznato';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.userName = '';
    this.router.navigateByUrl('/home');
  }

  user(){
    this.router.navigateByUrl('/korisnikDashbord');
  }

  updateUser(): void {
    this.korisnikService.updateKorisnik(this.korisnik).subscribe(
      response => {
        console.log('Korisnički podaci ažurirani:', response);
      },
      error => {
        console.error('Greška pri ažuriranju korisničkih podataka:', error);
      }
    );
  }

  openReviewDialog(flag: number, rezervacijaId: number,): void {
    const dialogRef = this.dialog.open(Recenzija2DialogComponent, {
      data: {
        korisnikId: this.authService.getUserId(), // Prosleđujemo ID korisnika
        rezervacijaId: rezervacijaId, // Prosleđujemo ID rezervacije
      },
    });

    dialogRef.componentInstance.flag = flag;

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dijalog je zatvoren');
      this.loadRecenzijaKorisnika(); // Osvežavanje liste recenzija nakon zatvaranja dijaloga
    });
  }

}
