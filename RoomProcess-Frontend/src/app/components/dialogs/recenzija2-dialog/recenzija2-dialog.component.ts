import { Component, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
//
import { MatSnackBar } from '@angular/material/snack-bar';
//Zbog date pickera 
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDateModule
import { Korisnik } from '../../../../models/korisnik';
import { Recenzija } from '../../../../models/recenzija';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecenzijaService } from '../../../../services/recenzija.service';
import { KorisnikService } from '../../../../services/korisnik.service';
import { RezervacijaService } from '../../../../services/rezervacija.service';
import { Rezervacija } from '../../../../models/rezervacija';

@Component({
  selector: 'app-recenzija2-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule, 
    CommonModule, 
    MatSelectModule, 
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './recenzija2-dialog.component.html',
  styleUrl: './recenzija2-dialog.component.css'
})
export class Recenzija2DialogComponent {

  flag!:number;
  

  public korisnik = new Korisnik;
  public rezervacija = new Rezervacija;

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Recenzija>,
   @Inject(MAT_DIALOG_DATA) public data: Recenzija,
    public recenzijaService: RecenzijaService,
    public korisnikService:KorisnikService,
    public rezervacijaService: RezervacijaService){

}

ngOnInit(): void {
  console.log(this.data);
  this.getKorisnik();
}


  public compare(a:any, b:any){
   return a.id == b.id
}

  public add():void{
    console.log(this.data);
    this.recenzijaService.addRecenzija(this.data).subscribe(
      () => {
        this.snackBar.open('Recenzija je uspesno kreiran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Kreiranje recenzije je neuspesno.', 'Ok', {duration:3500})
    }
   
}
//OVDE JE DODAT UPDATE PO ADMIN POINTU ZA AZURIRANJE
  public update():void{
    this.recenzijaService.updateRecenzija(this.data).subscribe(
      () => {
        this.snackBar.open('Recenzija sa ID: ' + this.data.recenzijaId + ' je uspesno azuriran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Azuriranje recenzija je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public delete():void{
    this.recenzijaService.deleteRecenzija(this.data.recenzijaId).subscribe(
      () => {
        this.snackBar.open('Recenzija sa ID: ' + this.data.recenzijaId + ' je uspesno obrisan.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Brisanje recenzije je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public cancel():void{
    this.dialogRef.close(); // referenca na trenutno otvoreni dialog
    this.snackBar.open('Odustali ste od izmena.', 'Ok', {duration:2500})
 }

 getKorisnik(): void {
  this.korisnikService.getKorisnikById(this.data.korisnikId).subscribe(
    (korisnik: Korisnik) => {
      this.korisnik = korisnik;
    },
    (error: any) => {
      console.error('Failed to load pozicije', error);
      this.snackBar.open('Neuspešno učitavanje korisnika.', 'Ok', { duration: 3500 });
    }
  );
}

}
