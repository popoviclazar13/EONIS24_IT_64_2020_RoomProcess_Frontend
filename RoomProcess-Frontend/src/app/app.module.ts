import { ApplicationRef, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from '@angular/platform-browser';
import { KorisnikComponent } from "./components/main/korisnik/korisnik.component";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { HttpClientModule, HttpXhrBackend, provideHttpClient, withInterceptors } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//Za rutiranje
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { KorisnikService } from "../services/korisnik.service";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { customInterceptor } from "../services/custom.interceptor";
import { AuthServiceService } from "../services/auth-service.service";
import { UlogaService } from "../services/uloga.service";
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardComponent } from "./components/dashbord/dashbord.component";
import { HomeComponent } from "./components/home/home.component";


@NgModule({
    declarations: [
      KorisnikComponent,
      //SignupComponent
    ],
    imports: [
        BrowserModule,
        //Materials
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        //
        HttpClientModule,
        //
        BrowserAnimationsModule,
        //Zbog Datapickera
        MatNativeDateModule,


        //Rutiranje
        RouterModule,
        RouterModule.forRoot(routes),
    ],
    providers:[
      KorisnikService,
      provideHttpClient(withInterceptors([customInterceptor]))
    ],
    exports: [RouterModule], //Za rutiranje
  })
  export class AppModule {
    constructor(private appRef: ApplicationRef) {}//Ovo je moralo da se doda zato sto je AppComponent StandAlone komponenta
                                                  //I onda se ide preko ngDoBootStrap() metode
    ngDoBootstrap() {
      this.appRef.bootstrap(AppComponent);
    }//
  }
  
  