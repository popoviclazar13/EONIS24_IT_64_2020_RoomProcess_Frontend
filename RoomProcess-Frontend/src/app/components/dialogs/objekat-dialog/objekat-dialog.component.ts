import { Component, Inject } from '@angular/core';
//importi za front
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Objekat } from '../../../../models/objekat';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ObjekatService } from '../../../../services/objekat.service';
import { KorisnikService } from '../../../../services/korisnik.service';
import { TipObjektaService } from '../../../../services/tipObjekta.service';
import { PopustService } from '../../../../services/popust.service';
import { Korisnik } from '../../../../models/korisnik';
import { TipObjekta } from '../../../../models/tipObjekta';
import { Popust } from '../../../../models/popust';
//

@Component({
  selector: 'app-objekat-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule, 
    CommonModule, 
    MatSelectModule, 
    FormsModule,
    MatInputModule
  ],
  templateUrl: './objekat-dialog.component.html',
  styleUrl: './objekat-dialog.component.css'
})
export class ObjekatDialogComponent {

  flag!:number;

  public korisnici: Korisnik [] = []
  public tipovi: TipObjekta [] = []
  public popusti: Popust [] = []

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Objekat>,
   @Inject(MAT_DIALOG_DATA) public data: Objekat,
    public objekatService:ObjekatService,
    public korisnikService:KorisnikService,
    public tipObjektaService:TipObjektaService,
    public popustService:PopustService,){

}

ngOnInit(): void {
  this.getKorisnike();
  this.getTipObjekata();
  this.getPopusti();
}


  public compare(a:any, b:any){
   return a.id == b.id
}

  public add():void{
    this.objekatService.addObjekat(this.data).subscribe(
      () => {
        this.snackBar.open('Objekat : ' + this.data.objekatNaziv + ' je uspesno kreiran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Kreiranje objekta je neuspesno.', 'Ok', {duration:3500})
    }
   
}
//OVDE JE DODAT UPDATE PO ADMIN POINTU ZA AZURIRANJE
  public update():void{
    this.objekatService.updateObjekat(this.data).subscribe(
      () => {
        this.snackBar.open('Objekat sa ID: ' + this.data.objekatId + ' je uspesno azuriran.',
        'Ok', {duration:3500})
        this.dialogRef.close();
      }
    ),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Azuriranje objekta je neuspesno.', 'Ok', {duration:3500})
    }
  }

  public delete():void{
    this.objekatService.deleteObjekat(this.data.objekatId).subscribe(
      () => {
        this.snackBar.open('Objekat sa ID: ' + this.data.objekatId + ' je uspesno obrisan.',
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
getTipObjekata(): void {
  this.tipObjektaService.getAllTipObjekta().subscribe(
    (tipovi: TipObjekta[]) => {
      this.tipovi = tipovi;
    },
    (error: any) => {
      console.error('Failed to load pozicije', error);
      this.snackBar.open('Neuspešno učitavanje tipova Objekta.', 'Ok', { duration: 3500 });
    }
  );
}
getPopusti(): void {
  this.popustService.getAllPopust().subscribe(
    (popusti: Popust[]) => {
      this.popusti = popusti;
    },
    (error: any) => {
      console.error('Failed to load pozicije', error);
      this.snackBar.open('Neuspešno učitavanje popusta.', 'Ok', { duration: 3500 });
    }
  );
}

}
