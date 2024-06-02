import { Component, Inject } from '@angular/core';
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
import { TipObjekta } from '../../../../models/tipObjekta';
import { TipObjektaService } from '../../../../services/tipObjekta.service';
//

@Component({
  selector: 'app-tip-objekta-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule, 
    CommonModule, 
    MatSelectModule, 
    FormsModule,
    MatInputModule
  ],
  templateUrl: './tip-objekta-dialog.component.html',
  styleUrl: './tip-objekta-dialog.component.css'
})
export class TipObjektaDialogComponent {

  flag!:number;

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Uloga>,
   @Inject(MAT_DIALOG_DATA) public data: TipObjekta,
    public tipObjektaService:TipObjektaService){

}


  public compare(a:any, b:any){
   return a.id == b.id
}

  public add():void{
    this.tipObjektaService.addTipObjekta(this.data).subscribe(
      () => {
        this.snackBar.open('Tip Objekta : ' + this.data.tipObjektaNaziv + ' je uspesno kreiran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Kreiranje tipa Objekta je neuspesno.', 'Ok', {duration:3500})
    }
}

  public update():void{
    this.tipObjektaService.updateTipObjekta(this.data).subscribe(
      () => {
        this.snackBar.open('Tip Objekta sa ID: ' + this.data.tipObjektaId + ' je uspesno azuriran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Azuriranje tipa Objekta je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public delete():void{
    this.tipObjektaService.deleteTipObjekta(this.data.tipObjektaId).subscribe(
      () => {
        this.snackBar.open('Tip Objekta sa ID: ' + this.data.tipObjektaId + ' je uspesno obrisan.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Brisanje tipa Objekta je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public cancel():void{
    this.dialogRef.close(); // referenca na trenutno otvoreni dialog
    this.snackBar.open('Odustali ste od izmena.', 'Ok', {duration:2500})
 }

}
