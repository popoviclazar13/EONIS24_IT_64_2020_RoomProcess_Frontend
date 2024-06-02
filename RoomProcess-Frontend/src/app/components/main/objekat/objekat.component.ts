import { Component, ViewChild } from '@angular/core';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from '../../../../services/auth-service.service';
import { ObjekatService } from '../../../../services/objekat.service';
import { MatDialog } from '@angular/material/dialog';
import { Objekat } from '../../../../models/objekat';
import { ObjekatDialogComponent } from '../../dialogs/objekat-dialog/objekat-dialog.component';
import { Router } from '@angular/router';
import { PopustService } from '../../../../services/popust.service';
import { KorisnikService } from '../../../../services/korisnik.service';
import { TipObjektaService } from '../../../../services/tipObjekta.service';
//

@Component({
  selector: 'app-objekat',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './objekat.component.html',
  styleUrl: './objekat.component.css'
})
export class ObjekatComponent {
  displayedColumns = [
    'objekatId',
    'objekatNaziv',
    'adresa',
    'grad',
    'cena',
    'x',
    'y',
    'korisnikId',
    'tipObjektaId',
    'popustId',
    'actions',
  ];

  dataSource!: MatTableDataSource<Objekat>; // ovo ce na sluziti da upisujemo nove vr i menjamo postojece
  isAdmin: boolean = false; // Dodajte promenljivu za proveru admina

  subscription!: Subscription;

  @ViewChild(MatSort, { static: false }) sort!: MatSort; // za sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator; // za paginator

  parentSelectedObjekat!: Objekat; //ovo je zbog selectRow dodato

  korisnikMap: Map<number, string> = new Map();
  tipObjektaMap: Map<number, string> = new Map();
  popustMap: Map<number, string> = new Map();

  constructor(
    private objekatService: ObjekatService,
    public dialog: MatDialog,
    private router: Router,    //Zbog turiranja
    private popustService: PopustService,
    private korisnikService: KorisnikService,
    private tipObjektaService: TipObjektaService,
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

    this.tipObjektaService.getAllTipObjekta().subscribe(data => {
      data.forEach((tip: any) => {
        this.tipObjektaMap.set(tip.tipObjektaId, tip.tipObjektaNaziv);
      });
    });

    this.popustService.getAllPopust().subscribe(data => {
      data.forEach((popust: any) => {
        this.popustMap.set(popust.popustId, popust.popustNaziv);
      });
    });
  }

  //sa ovom metodom povezujemo front i bekend
  public loadData() {
    (this.subscription = this.objekatService.getAllObjekat().subscribe(
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

  public openDialog(flag: number, uloga?: Objekat): void {
    const dialogRef = this.dialog.open(ObjekatDialogComponent, {
      data: uloga ? uloga : new Objekat(),
    });
    dialogRef.componentInstance.flag = flag;
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();   
    });
  }

  public selectRow(row: Objekat): void {
    //this.parentSelectedKorisnik = row;
    this.parentSelectedObjekat = row;
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
  findPopust(popustId: number){
    return this.popustMap.get(popustId) || 'Nepoznato';
  }
  findTipObjekta(tipObjektaId: number){
    return this.tipObjektaMap.get(tipObjektaId) || 'Nepoznato';
  }

}
