import { Component, ViewChild } from '@angular/core';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
//
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { Recenzija } from '../../../../models/recenzija';
import { RecenzijaService } from '../../../../services/recenzija.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KorisnikService } from '../../../../services/korisnik.service';
import { RezervacijaService } from '../../../../services/rezervacija.service';
import { AuthServiceService } from '../../../../services/auth-service.service';
import { RecenzijaDialogComponent } from '../../dialogs/recenzija-dialog/recenzija-dialog.component';

@Component({
  selector: 'app-recenzija',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './recenzija.component.html',
  styleUrl: './recenzija.component.css'
})
export class RecenzijaComponent {
  displayedColumns = [
    'recenzijaId',
    'tekst',
    'datum',
    'lokacija',
    'cistoca',
    'osoblje',
    'sadrzaj',
    'cenaKvalitet',
    'ocena',
    'korisnikId',
    'rezervacijaId',
    'actions',
  ]; 

  dataSource!: MatTableDataSource<Recenzija>; // ovo ce na sluziti da upisujemo nove vr i menjamo postojece
  isAdmin: boolean = false; // Dodajte promenljivu za proveru admina

  subscription!: Subscription;

  @ViewChild(MatSort, { static: false }) sort!: MatSort; // za sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator; // za paginator

  parentSelectedRecenzija!: Recenzija; //ovo je zbog selectRow dodato

  korisnikMap: Map<number, string> = new Map();
  rezervacijaMap: Map<number, string> = new Map();

  constructor(
    private recenzijaService: RecenzijaService,
    public dialog: MatDialog,
    private router: Router,    //Zbog turiranja
    private korisnikService: KorisnikService,
    private authService: AuthServiceService // Za admina
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.loadMappings();
    this.loadData();
    //this.checkAdminRole();
  }

  private loadMappings(): void {
    // Pretpostavka je da ovi servisi postoje i vraćaju Observable sa mapom ili listom
    this.korisnikService.getAllKorisnik().subscribe(data => {
      data.forEach((korisnik: any) => {
        this.korisnikMap.set(korisnik.korisnikId, korisnik.ime);
      });
    });

    //Ne treba mi rezervacijaServis zato sto rezervacija nema NAZIV, jedinstveno se prikazuje sa ID

  }

  //sa ovom metodom povezujemo front i bekend
  public loadData() {
    (this.subscription = this.recenzijaService.getAllRecenzija().subscribe(
      //lamda izraz
      (data) => {
        //console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    )),
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      };
  }

  public openDialog(flag: number, uloga?: Recenzija): void {
    const dialogRef = this.dialog.open(RecenzijaDialogComponent, {
      data: uloga ? uloga : new Recenzija(),
    });
    dialogRef.componentInstance.flag = flag;
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();   
    });
  }

  public selectRow(row: Recenzija): void {
    //this.parentSelectedKorisnik = row;
    this.parentSelectedRecenzija = row;
  }

  //za filtriranje

  public applyFilter(filter: any) {
    filter = filter.target.value; // prihvata vrednost koju smo ukucali
    filter = filter.trim(); // vrsi trim, ako postoje space oni se brisu
    filter = filter.toLocaleLowerCase(); // prebacuje sadrzaj u mala slova
    this.dataSource.filter = filter; // dodeljujemo vrednost datesource filter
  }

  //Za admina 
  checkAdminRole(): void {
    // Pozovite servis AuthServiceService da dobijete ulogu korisnika
    const role = this.authService.getUserRole();

    // Proverite da li je uloga admin
    if (role === 1) {
      this.isAdmin = true; // Postavite isAdmin na true ako je korisnik admin
    }
  }
  findKorisnik(korisnikId: number){
    return this.korisnikMap.get(korisnikId) || 'Nepoznato';
  }

}
