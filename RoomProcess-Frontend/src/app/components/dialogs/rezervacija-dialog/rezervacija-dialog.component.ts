import { Component, Inject } from '@angular/core';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
//Zbog date pickera 
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDateModule
//
import { MatCheckboxModule } from '@angular/material/checkbox'; //Za checkbox
//
import { Korisnik } from '../../../../models/korisnik';
import { Objekat } from '../../../../models/objekat';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Rezervacija } from '../../../../models/rezervacija';
import { ObjekatService } from '../../../../services/objekat.service';
import { KorisnikService } from '../../../../services/korisnik.service';
import { RezervacijaService } from '../../../../services/rezervacija.service';



@Component({
  selector: 'app-rezervacija-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule, 
    CommonModule, 
    MatSelectModule, 
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './rezervacija-dialog.component.html',
  styleUrl: './rezervacija-dialog.component.css',
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'sr-RS' } // Prilagođavanje lokalizacije, opcionalno
  ]
})
export class RezervacijaDialogComponent {

  flag!:number;

  public korisnici: Korisnik [] = []
  public objekti: Objekat [] = []

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Rezervacija>,
   @Inject(MAT_DIALOG_DATA) public data: Rezervacija,
    public rezervacijaService: RezervacijaService,
    public objekatService:ObjekatService,
    public korisnikService:KorisnikService,){

}

ngOnInit(): void {
  this.getKorisnike();
  this.getObjekte();
}


  public compare(a:any, b:any){
   return a.id == b.id
}

  public add():void{
    this.rezervacijaService.addRezervacija(this.data).subscribe(
      () => {
        this.snackBar.open('Rezervacija : ' + this.data.rezervacijaId + ' je uspesno kreiran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Kreiranje rezervacije je neuspesno.', 'Ok', {duration:3500})
    }
   
}
//OVDE JE DODAT UPDATE PO ADMIN POINTU ZA AZURIRANJE
  public update():void{
    this.rezervacijaService.updateRezervacija(this.data).subscribe(
      () => {
        this.snackBar.open('Rezervacija sa ID: ' + this.data.rezervacijaId + ' je uspesno azuriran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Azuriranje rezervacije je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public delete():void{
    this.rezervacijaService.deleteRezervacija(this.data.rezervacijaId).subscribe(
      () => {
        this.snackBar.open('Rezervacija sa ID: ' + this.data.rezervacijaId + ' je uspesno obrisan.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Brisanje rezervacija je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public cancel():void{
    this.dialogRef.close(); // referenca na trenutno otvoreni dialog
    this.snackBar.open('Odustali ste od izmena.', 'Ok', {duration:2500})
 }
//Za korisnika, tipObjekta i popust
getKorisnike(): void {
  this.korisnikService.getAllKorisnik().subscribe(
    (korisnici: Korisnik[]) => {
      this.korisnici = korisnici;
    },
    (error: any) => {
      console.error('Failed to load pozicije', error);
      this.snackBar.open('Neuspešno učitavanje korisnika.', 'Ok', { duration: 3500 });
    }
  );
}
getObjekte(): void {
  this.objekatService.getAllObjekat().subscribe(
    (objekti: Objekat[]) => {
      this.objekti = objekti;
    },
    (error: any) => {
      console.error('Failed to load pozicije', error);
      this.snackBar.open('Neuspešno učitavanje pbjekata.', 'Ok', { duration: 3500 });
    }
  );
}

}
