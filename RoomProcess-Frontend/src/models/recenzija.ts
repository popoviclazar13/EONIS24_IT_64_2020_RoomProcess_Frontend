import { Korisnik } from "./korisnik";
import { Rezervacija } from "./rezervacija";

export class Recenzija {
    recenzijaId!: number;
    tekst!: string;
    datum!: Date;
    lokacija!: number;
    cistoca!: number;
    osoblje!: number;
    sadrzaj!: number;
    cenaKvalitet!: number;
    ocena!: number;
    korisnikId!: number;
    korisnik!: Korisnik;
    rezervacijaId!: number;
    rezervacija!: Rezervacija;
  }