import { Uloga } from "./uloga";

export class Korisnik {
    korisnikId!: number;
    ime!: string;
    prezime!: string;
    email!: string;
    password!: string;
    passwordSalt!: string;
    passwordHash!: string;
    ulogaId!: number;
    uloga!: Uloga;
  }