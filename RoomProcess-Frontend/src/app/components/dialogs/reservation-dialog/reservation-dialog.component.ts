import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Objekat } from '../../../../models/objekat';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDateModule
import { Recenzija } from '../../../../models/recenzija';
import { Rezervacija } from '../../../../models/rezervacija';
import { Subscription } from 'rxjs';
import { RecenzijaService } from '../../../../services/recenzija.service';
import { RezervacijaService } from '../../../../services/rezervacija.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
//
//ZA STRIPE
import { StripeService } from '../../../../services/stripe.service';
//

@Component({
  selector: 'app-reservation-dialog',
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
  templateUrl: './reservation-dialog.component.html',
  styleUrl: './reservation-dialog.component.css'
})
export class ReservationDialogComponent {

  minDate: Date;

  recenzije: Recenzija[] = [];
  rezervacije: Rezervacija[] = [];
  subscription!: Subscription;
  novaRezervacija: Rezervacija = {} as Rezervacija;

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { objekat: Objekat, startDate: Date, endDate: Date },
    public recenzijaService: RecenzijaService,
    public rezervacijaService: RezervacijaService,
    private router: Router,
    private stripeService: StripeService // Dodajte ovde StripeService
  ) {
    this.minDate = new Date(); // Postavlja minDate na današnji datum
  }

  ngOnInit(): void {
    this.loadRezervacije();
    this.loadRecenzija();
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.snackBar.open(`Odustali ste od Rezervacije za Objekat: ${this.data.objekat.objekatNaziv}`, 'Ok', {duration:2500})
  }

  reserve(): void {
    debugger

    const korisnikIdLocal = localStorage.getItem('korisnikId') !== null ? parseInt(localStorage.getItem('korisnikId') || '0') : 0;

    if (!korisnikIdLocal) {
      alert('Da bi nastavili rezervaciju morate se ulogovati.');
      this.router.navigateByUrl('/'); // Preusmeravanje na početnu stranicu
      this.dialogRef.close();
      return; // Prekid izvršavanja funkcije ako korisnik nije ulogovan
    }

    if (this.data.startDate >= this.data.endDate) {
      alert('Datum dolaska mora biti pre datuma odlaska.');
      return;
    }

    const novaRezervacija: Rezervacija = {
      rezervacijaId: 0,
      datumDolaska: this.data.startDate,
      datumOdlaska: this.data.endDate,
      korisnikId: +korisnikIdLocal, // Postavite korisnika koji je trenutno prijavljen (id korisnika koji je napravio rezervaciju)
      objekatId: this.data.objekat.objekatId // Postavite id objekta za koji se vrši rezervacija
      ,
    };

    //Moralo ovo da se doda posot hvata za 1 dan manje!
    novaRezervacija.datumDolaska.setDate(novaRezervacija.datumDolaska.getDate() + 1);

    // Dodaj jedan dan na datum odlaska
    novaRezervacija.datumOdlaska.setDate(novaRezervacija.datumOdlaska.getDate() + 1);

    // Pozivanje servisa za kreiranje rezervacije
  this.rezervacijaService.addRezervacija(novaRezervacija).subscribe(
    (response: any) => {
   // BEZ OVOGA NE PREPOZNAJE DA JE JSON OBJEKAT !!!!
      const createdReservation: Rezervacija = JSON.parse(response); // MORA PARSIRANJE U JSON OBJEKAT 
        this.novaRezervacija = {
          rezervacijaId: createdReservation.rezervacijaId,
          datumDolaska: new Date(createdReservation.datumDolaska),
          datumOdlaska: new Date(createdReservation.datumOdlaska),
          cena: createdReservation.cena,
          brojNocenja: createdReservation.brojNocenja,
          potvrda: createdReservation.potvrda,
          korisnikId: createdReservation.korisnikId,
          objekatId: createdReservation.objekatId
        };


      console.log('Kreirana rezervacija:', this.novaRezervacija.cena);
      console.log('Kreirana rezervacija:', this.novaRezervacija.datumDolaska);
      console.log('Kreirana rezervacija:', this.novaRezervacija.datumOdlaska);

      const totalPrice = this.novaRezervacija.cena ?? 0;

      console.log(totalPrice);
      this.stripeService.createCheckoutSession(totalPrice).subscribe(
        (stripeResponse) => {
          const sessionId = stripeResponse.sessionId;
          console.log('Session ID:', stripeResponse.sessionId); // Ovde možete koristiti dobijeni Session ID
          // Redirect korisnika na Checkout stranicu koristeći dobijeni Session ID
          //window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
          window.location.href = `${sessionId}`;
        },
        (stripeError) => {
          console.error('Greška prilikom kreiranja sesije na Stripe-u:', stripeError);
        }
      );

      // Zatvaranje dijaloškog prozora
      this.dialogRef.close();

      // Prikazivanje snack bara sa porukom i opcijom 'Ok'
      //this.snackBar.open(`Rezervacija uspešno kreirana! Ukupna cena: ${totalPrice}`, 'Ok', { duration: 5000 });
      //console.log(this.novaRezervacija);

    },
    (error) => {
      // Greška prilikom kreiranja rezervacije, prikazivanje poruke o grešci u snack baru
      this.snackBar.open(`Greška prilikom kreiranja rezervacije: ${error.message}`, 'Ok', { duration: 5000 });
    }
  );
  }

  public getOcenaRecenzije(objekatId: number): string {
    const relevantRezervacije = this.rezervacije.filter(r => r.objekatId === objekatId);
    const relevantRecenzije = this.recenzije.filter(rec => 
      relevantRezervacije.some(rez => rez.rezervacijaId === rec.rezervacijaId)
    );
  
    if (relevantRecenzije.length > 0) {
      const sumaOcena = relevantRecenzije.reduce((sum, r) => sum + r.ocena, 0);
      const prosekOcena = sumaOcena / relevantRecenzije.length;
      return prosekOcena.toFixed(2);
    } else {
      return 'Nema ostavljenih recenzija!';
    }
  }

  public loadRezervacije() {
    this.subscription = this.rezervacijaService.getAllRezervacija().subscribe(
      (data) => {
        this.rezervacije = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  public loadRecenzija() {
    this.subscription = this.recenzijaService.getAllRecenzija().subscribe(
      (data) => {
        this.recenzije = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

}
