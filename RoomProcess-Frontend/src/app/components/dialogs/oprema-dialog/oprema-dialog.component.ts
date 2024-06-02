import { OpremaService } from './../../../../services/oprema.service';
import { Component, Inject } from '@angular/core';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
//
import { MatSnackBar } from '@angular/material/snack-bar';
import { Objekat } from '../../../../models/objekat';
import { Oprema } from '../../../../models/oprema';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ObjekatService } from '../../../../services/objekat.service';


@Component({
  selector: 'app-oprema-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule, 
    CommonModule, 
    MatSelectModule, 
    FormsModule,
    MatInputModule
  ],
  templateUrl: './oprema-dialog.component.html',
  styleUrl: './oprema-dialog.component.css'
})
export class OpremaDialogComponent {

  flag!:number;

  public objekti: Objekat [] = []

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Oprema>,
   @Inject(MAT_DIALOG_DATA) public data: Oprema,
    public opremaService: OpremaService,
    public objekatService:ObjekatService,){

}

ngOnInit(): void {
  this.getObjekti();
}


  public compare(a:any, b:any){
   return a.id == b.id
}

  public add():void{
    this.opremaService.addOprema(this.data).subscribe(
      () => {
        this.snackBar.open('Oprema : ' + this.data.opremaNaziv + ' je uspesno kreiran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Kreiranje opreme je neuspesno.', 'Ok', {duration:3500})
    }
   
}
//OVDE JE DODAT UPDATE PO ADMIN POINTU ZA AZURIRANJE
  public update():void{
    this.opremaService.updateOprema(this.data).subscribe(
      () => {
        this.snackBar.open('Oprema sa ID: ' + this.data.opremaId + ' je uspesno azuriran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Azuriranje opreme je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public delete():void{
    this.opremaService.deleteOprema(this.data.opremaId).subscribe(
      () => {
        this.snackBar.open('Oprema sa ID: ' + this.data.opremaId + ' je uspesno obrisan.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Brisanje objekta je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public cancel():void{
    this.dialogRef.close(); // referenca na trenutno otvoreni dialog
    this.snackBar.open('Odustali ste od izmena.', 'Ok', {duration:2500})
 }
//Za korisnika, tipObjekta i popust
getObjekti(): void {
  this.objekatService.getAllObjekat().subscribe(
    (objekti: Objekat[]) => {
      this.objekti = objekti;
    },
    (error: any) => {
      console.error('Failed to load pozicije', error);
      this.snackBar.open('Neuspešno učitavanje objekata.', 'Ok', { duration: 3500 });
    }
  );
}

}
