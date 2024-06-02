import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopustService } from '../../../../services/popust.service';
import { MatDialog } from '@angular/material/dialog';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Popust } from '../../../../models/popust';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from '../../../../services/auth-service.service';
import { PopustDialogComponent } from '../../dialogs/popust-dialog/popust-dialog.component';
//

@Component({
  selector: 'app-popust',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './popust.component.html',
  styleUrl: './popust.component.css'
})
export class PopustComponent {
  displayedColumns = [
    'popustId',
    'popustNaziv',
    'popustIznos',
    'actions',
  ];

  dataSource!: MatTableDataSource<Popust>; // ovo ce na sluziti da upisujemo nove vr i menjamo postojece
  isAdmin: boolean = false; // Dodajte promenljivu za proveru admina

  subscription!: Subscription;

  @ViewChild(MatSort, { static: false }) sort!: MatSort; // za sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator; // za paginator

  parentSelectedUloga!: Popust; //ovo je zbog selectRow dodato

  constructor(
    private popustService: PopustService,
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
    (this.subscription = this.popustService.getAllPopust().subscribe(
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

  public openDialog(flag: number, uloga?: Popust): void {
    const dialogRef = this.dialog.open(PopustDialogComponent, {
      data: uloga ? uloga : new Popust(),
    });
    dialogRef.componentInstance.flag = flag;
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();   
    });
  }

  public selectRow(row: Popust): void {
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
