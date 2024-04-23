import { Korisnik } from './korisnik';
import { Objekat } from './objekat';
export class Rezervacija {
    rezervacijaId!: number;
    datumDolaska!: Date;
    datumOdlaska!: Date;
    cena!: number;
    brojNocenja!: number;
    potvrda!: boolean;
    korisnikId!: number;
    korisnik!: Korisnik;
    objekatId!: number;
    objekat!:Objekat
  }