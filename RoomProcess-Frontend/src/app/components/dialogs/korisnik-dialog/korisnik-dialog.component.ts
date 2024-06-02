import { Component, Inject, OnInit } from '@angular/core';
import { Korisnik } from '../../../../models/korisnik';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KorisnikService } from '../../../../services/korisnik.service';
import { MatSnackBar } from '@angular/material/snack-bar';
//importi za front
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { UlogaService } from '../../../../services/uloga.service';
import { MatInputModule } from '@angular/material/input';
import { Uloga } from '../../../../models/uloga';
//

@Component({
  selector: 'app-korisnik-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule, 
    CommonModule, 
    MatSelectModule, 
    FormsModule,
    MatInputModule],
  templateUrl: './korisnik-dialog.component.html',
  styleUrl: './korisnik-dialog.component.css'
})
export class KorisnikDialogComponent implements OnInit {

  flag!:number;

  public uloge: Uloga [] = []

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Korisnik>,
   @Inject(MAT_DIALOG_DATA) public data: Korisnik,
    public korisnikService:KorisnikService,
    public ulogaService:UlogaService){

}

ngOnInit(): void {
  this.getUloge();
}


  public compare(a:any, b:any){
   return a.id == b.id
}

  public add():void{
    this.korisnikService.addKorisnikAdmin(this.data).subscribe(
      () => {
        this.snackBar.open('Korisnik : ' + this.data.ime + ' je uspesno kreiran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Kreiranje korisnika je neuspesno.', 'Ok', {duration:3500})
    }
   
}
//OVDE JE DODAT UPDATE PO ADMIN POINTU ZA AZURIRANJE
  public update():void{
    this.korisnikService.updateKorisnikAdmin(this.data).subscribe(
      () => {
        this.snackBar.open('Korisnik sa ID: ' + this.data.korisnikId + ' je uspesno azuriran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Azuriranje korisnika je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public delete():void{
    this.korisnikService.deleteKorisnik(this.data.korisnikId).subscribe(
      () => {
        this.snackBar.open('Korisnik sa ID: ' + this.data.korisnikId + ' je uspesno obrisan.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Brisanje korisnika je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public cancel():void{
    this.dialogRef.close(); // referenca na trenutno otvoreni dialog
    this.snackBar.open('Odustali ste od izmena.', 'Ok', {duration:2500})
 }
//Za uloge
getUloge(): void {
  console.log('getUloge called'); // Dodajte ovaj red
  this.ulogaService.getAllUloga().subscribe(
    (uloge: Uloga[]) => {
      this.uloge = uloge;
      console.log('Uloge:', this.uloge); // Dodajte ovaj red da proverite uloge
    },
    (error: any) => {
      console.error('Failed to load pozicije', error);
      this.snackBar.open('Neuspešno učitavanje uloga.', 'Ok', { duration: 3500 });
    }
  );
}

}
