import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from '@angular/platform-browser';
import { KorisnikComponent } from "./components/main/korisnik/korisnik.component";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
    declarations: [
      KorisnikComponent,
    ],
    imports: [
        BrowserModule,
        //Materials
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule
    ],
    bootstrap: [AppComponent],
  })
  export class AppModule {}