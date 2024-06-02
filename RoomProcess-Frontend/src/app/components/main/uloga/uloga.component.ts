import { Component, ViewChild } from '@angular/core';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
//
import { Uloga } from '../../../../models/uloga';
import { Subscription } from 'rxjs';
import { UlogaService } from '../../../../services/uloga.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { UlogaDialogComponent } from '../../dialogs/uloga-dialog/uloga-dialog.component';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../../services/auth-service.service';

@Component({
  selector: 'app-uloga',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule, 
  ],
  templateUrl: './uloga.component.html',
  styleUrl: './uloga.component.css'
})
export class UlogaComponent {
  displayedColumns = [
    'ulogaId',
    'ulogaNaziv',
    'actions',
  ];

  dataSource!: MatTableDataSource<Uloga>; // ovo ce na sluziti da upisujemo nove vr i menjamo postojece
  isAdmin: boolean = false; // Dodajte promenljivu za proveru admina

  subscription!: Subscription;

  @ViewChild(MatSort, { static: false }) sort!: MatSort; // za sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator; // za paginator

  parentSelectedUloga!: Uloga; //ovo je zbog selectRow dodato

  constructor(
    private ulogaService: UlogaService,
    public dialog: MatDialog,
    private router: Router,    //Zbog turiranja
    private authService: AuthServiceService // Za admina
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.loadData();
  }

  //sa ovom metodom povezujemo front i bekend
  public loadData() {
    (this.subscription = this.ulogaService.getAllUloga().subscribe(
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

  public openDialog(flag: number, uloga?: Uloga): void {
    const dialogRef = this.dialog.open(UlogaDialogComponent, {
      data: uloga ? uloga : new Uloga(),
    });
    dialogRef.componentInstance.flag = flag;
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();   
    });
  }

  public selectRow(row: Uloga): void {
    //this.parentSelectedKorisnik = row;
    this.parentSelectedUloga = row;
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
