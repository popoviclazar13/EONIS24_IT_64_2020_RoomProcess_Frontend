import { Component, Inject } from '@angular/core';
//importi za front
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Popust } from '../../../../models/popust';
import { PopustService } from '../../../../services/popust.service';
//

@Component({
  selector: 'app-popust-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule, 
    CommonModule, 
    MatSelectModule, 
    FormsModule,
    MatInputModule
  ],
  templateUrl: './popust-dialog.component.html',
  styleUrl: './popust-dialog.component.css'
})
export class PopustDialogComponent {

  flag!:number;

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Popust>,
   @Inject(MAT_DIALOG_DATA) public data: Popust,
    public popustService:PopustService){

}


  public compare(a:any, b:any){
   return a.id == b.id
}

  public add():void{
    this.popustService.addPopust(this.data).subscribe(
      () => {
        this.snackBar.open('Popust : ' + this.data.popustNaziv + ' je uspesno kreiran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Kreiranje popusta je neuspesno.', 'Ok', {duration:3500})
    }
}

  public update():void{
    this.popustService.updatePopust(this.data).subscribe(
      () => {
        this.snackBar.open('Popust sa ID: ' + this.data.popustId + ' je uspesno azuriran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Azuriranje popusta je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public delete():void{
    this.popustService.deletePopust(this.data.popustId).subscribe(
      () => {
        this.snackBar.open('Popust sa ID: ' + this.data.popustId + ' je uspesno obrisan.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Brisanje popusta je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public cancel():void{
    this.dialogRef.close(); // referenca na trenutno otvoreni dialog
    this.snackBar.open('Odustali ste od izmena.', 'Ok', {duration:2500})
 }

}
