import { Popust } from './popust';
import { Korisnik } from "./korisnik";
import { TipObjekta } from "./tipObjekta";

export class Objekat {
    objekatId!: number;
    objekatNaziv!: string;
    adresa!: string;
    grad!: string;
    cena!: number;
    x!: number;
    y!: number;
    korisnikId!: number;
    korisnik!: Korisnik;
    tipObjektaId!: number;
    tipObjekta!: TipObjekta;
    popustId!: number;
    popust!: Popust;
  }