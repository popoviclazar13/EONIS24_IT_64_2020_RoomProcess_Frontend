import { Component, Inject, OnInit } from '@angular/core';
//importi za front
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { UlogaService } from '../../../../services/uloga.service';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Uloga } from '../../../../models/uloga';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//

@Component({
  selector: 'app-uloga-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule, 
    CommonModule, 
    MatSelectModule, 
    FormsModule,
    MatInputModule
  ],
  templateUrl: './uloga-dialog.component.html',
  styleUrl: './uloga-dialog.component.css'
})
export class UlogaDialogComponent {

  flag!:number;

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Uloga>,
   @Inject(MAT_DIALOG_DATA) public data: Uloga,
    public ulogaService:UlogaService){

}


  public compare(a:any, b:any){
   return a.id == b.id
}

  public add():void{
    this.ulogaService.addUloga(this.data).subscribe(
      () => {
        this.snackBar.open('Uloga : ' + this.data.ulogaNaziv + ' je uspesno kreiran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Kreiranje uloge je neuspesno.', 'Ok', {duration:3500})
    }
}

  public update():void{
    this.ulogaService.updateUloga(this.data).subscribe(
      () => {
        this.snackBar.open('Uloga sa ID: ' + this.data.ulogaId + ' je uspesno azuriran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Azuriranje uloge je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public delete():void{
    this.ulogaService.deleteUloga(this.data.ulogaId).subscribe(
      () => {
        this.snackBar.open('Uloga sa ID: ' + this.data.ulogaId + ' je uspesno obrisan.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Brisanje uloge je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public cancel():void{
    this.dialogRef.close(); // referenca na trenutno otvoreni dialog
    this.snackBar.open('Odustali ste od izmena.', 'Ok', {duration:2500})
 }

}
