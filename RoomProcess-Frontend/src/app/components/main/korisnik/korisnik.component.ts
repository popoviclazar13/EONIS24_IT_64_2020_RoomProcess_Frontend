import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Korisnik } from '../../../../models/korisnik';
import { Subscription } from 'rxjs';
import { KorisnikService } from '../../../../services/korisnik.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Uloga } from '../../../../models/uloga';
import { KorisnikDialogComponent } from '../../dialogs/korisnik-dialog/korisnik-dialog.component';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../../services/auth-service.service';
import { UlogaService } from '../../../../services/uloga.service';

@Component({
  selector: 'app-korisnik',
  templateUrl: './korisnik.component.html',
  styleUrl: './korisnik.component.css'
})
export class KorisnikComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'korisnikId',
    'ime',
    'prezime',
    'email',
    'password',
    'ulogaId',
    'actions',
  ]; // ovde smo rekli sta cemo sve da prikazemo

  dataSource!: MatTableDataSource<Korisnik>; // ovo ce na sluziti da upisujemo nove vr i menjamo postojece
  isAdmin: boolean = false; // Dodajte promenljivu za proveru admina

  subscription!: Subscription;

  public korisnik = new Korisnik();
  public uloga = new Uloga();

  @ViewChild(MatSort, { static: false }) sort!: MatSort; // za sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator; // za paginator

  parentSelectedKorisnik!: Korisnik; //ovo je zbog selectRow dodato
  ulogaMap: Map<number, string> = new Map();

  constructor(
    private korisnikService: KorisnikService,
    public dialog: MatDialog,
    private router: Router,    //Zbog turiranja
    private authService: AuthServiceService, // Za admina
    private ulogaService: UlogaService
  ) {}

  goToAboutPage() {
    this.router.navigate(['korisnik']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.loadData();
    this.loadMappings();
  }

  //sa ovom metodom povezujemo front i bekend
  public loadData() {
    (this.subscription = this.korisnikService.getAllKorisnik().subscribe(
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
  private loadMappings(): void {
    // Pretpostavka je da ovi servisi postoje i vraćaju Observable sa mapom ili listom
    this.ulogaService.getAllUloga().subscribe(data => {
      data.forEach((uloga: any) => {
        this.ulogaMap.set(uloga.ulogaId, uloga.ulogaNaziv);
      });
    });
  }

  public openDialog(flag: number, korisnik?: Korisnik): void {
    const dialogRef = this.dialog.open(KorisnikDialogComponent, {
      data: korisnik ? korisnik : new Korisnik(),
    });
    dialogRef.componentInstance.flag = flag;
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();      
    });
  }

  findKorisnik(korisnikId: number){
    return this.ulogaMap.get(korisnikId) || 'Nepoznato';
  }

  public getColorForDisplay(int: number){
    if(int == 1)
      return "Red";
    if(int == 2)
      return "Yellow";
    else
    return "Green";
  }

  public selectRow(row: Korisnik): void {
    //this.parentSelectedKorisnik = row;
    this.parentSelectedKorisnik = row;
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
}
