import { Component, ViewChild } from '@angular/core';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { TipObjekta } from '../../../../models/tipObjekta';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { TipObjektaService } from '../../../../services/tipObjekta.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../../services/auth-service.service';
import { TipObjektaDialogComponent } from '../../dialogs/tip-objekta-dialog/tip-objekta-dialog.component';
//

@Component({
  selector: 'app-tip-objekta',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule, 
  ],
  templateUrl: './tip-objekta.component.html',
  styleUrl: './tip-objekta.component.css'
})
export class TipObjektaComponent {
  displayedColumns = [
    'tipObjektaId',
    'tipObjektaNaziv',
    'actions',
  ];

  dataSource!: MatTableDataSource<TipObjekta>; // ovo ce na sluziti da upisujemo nove vr i menjamo postojece
  isAdmin: boolean = false; // Dodajte promenljivu za proveru admina

  subscription!: Subscription;

  @ViewChild(MatSort, { static: false }) sort!: MatSort; // za sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator; // za paginator

  parentSelectedUloga!: TipObjekta; //ovo je zbog selectRow dodato

  constructor(
    private tipObjektaService: TipObjektaService,
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
    (this.subscription = this.tipObjektaService.getAllTipObjekta().subscribe(
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

  public openDialog(flag: number, uloga?: TipObjekta): void {
    const dialogRef = this.dialog.open(TipObjektaDialogComponent, {
      data: uloga ? uloga : new TipObjekta(),
    });
    dialogRef.componentInstance.flag = flag;
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();   
    });
  }

  public selectRow(row: TipObjekta): void {
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
