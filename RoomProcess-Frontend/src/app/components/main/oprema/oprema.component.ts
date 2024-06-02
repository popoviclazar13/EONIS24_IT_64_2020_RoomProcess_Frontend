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
import { Oprema } from '../../../../models/oprema';
import { OpremaService } from '../../../../services/oprema.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ObjekatService } from '../../../../services/objekat.service';
import { OpremaDialogComponent } from '../../dialogs/oprema-dialog/oprema-dialog.component';
//

@Component({
  selector: 'app-oprema',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './oprema.component.html',
  styleUrl: './oprema.component.css'
})
export class OpremaComponent {
  displayedColumns = [
    'opremaId',
    'opremaNaziv',
    'objekatId',
    'actions',
  ];     

  dataSource!: MatTableDataSource<Oprema>; // ovo ce na sluziti da upisujemo nove vr i menjamo postojece
  isAdmin: boolean = false; // Dodajte promenljivu za proveru admina

  subscription!: Subscription;

  @ViewChild(MatSort, { static: false }) sort!: MatSort; // za sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator; // za paginator

  parentSelectedOprema!: Oprema; //ovo je zbog selectRow dodato

  objekatMap: Map<number, string> = new Map();

  constructor(
    private opremaService: OpremaService,
    public dialog: MatDialog,
    private router: Router,    //Zbog turiranja
    private objekatService: ObjekatService,
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
    this.objekatService.getAllObjekat().subscribe(data => {
      data.forEach((objekat: any) => {
        this.objekatMap.set(objekat.objekatId, objekat.objekatNaziv);
      });
    });
  }

  //sa ovom metodom povezujemo front i bekend
  public loadData() {
    (this.subscription = this.opremaService.getAllOprema().subscribe(
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

  public openDialog(flag: number, uloga?: Oprema): void {
    const dialogRef = this.dialog.open(OpremaDialogComponent, {
      data: uloga ? uloga : new Oprema(),
    });
    dialogRef.componentInstance.flag = flag;
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();   
    });
  }

  public selectRow(row: Oprema): void {
    //this.parentSelectedKorisnik = row;
    this.parentSelectedOprema = row;
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
  findObjekat(objekatId: number){
    return this.objekatMap.get(objekatId) || 'Nepoznato';
  }

}
