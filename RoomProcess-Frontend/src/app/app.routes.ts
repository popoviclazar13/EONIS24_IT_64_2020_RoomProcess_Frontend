import { Routes } from '@angular/router';
import { KorisnikComponent } from './components/main/korisnik/korisnik.component';
import { PopustComponent } from './components/main/popust/popust.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ObjekatComponent } from './components/main/objekat/objekat.component';
import { OpremaComponent } from './components/main/oprema/oprema.component';
import { RecenzijaComponent } from './components/main/recenzija/recenzija.component';
import { RezervacijaComponent } from './components/main/rezervacija/rezervacija.component';
import { TipObjektaComponent } from './components/main/tip-objekta/tip-objekta.component';
import { UlogaComponent } from './components/main/uloga/uloga.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashbord/dashbord.component';
import { AdminDashbordComponent } from './components/admin-dashbord/admin-dashbord.component';
import { VlasnikDashbordComponent } from './components/vlasnik-dashbord/vlasnik-dashbord.component';
//Dodato da bi ako KORISNIK pokusa da pristupi nekoj admin stranici da ga rutira na home!
import { authGuard } from './auth.guard';
import { KorisnikDashbordComponent } from './components/korisnik-dashbord/korisnik-dashbord.component';
//

export const routes: Routes = [

    {path: 'korisnik', component: KorisnikComponent, canActivate: [authGuard]},
    {path: 'objekat', component: ObjekatComponent},
    {path: 'oprema', component: OpremaComponent, canActivate: [authGuard]},
    {path: 'popust', component: PopustComponent, canActivate: [authGuard]},
    {path: 'recenzija', component: RecenzijaComponent, canActivate: [authGuard]},
    {path: 'rezervacija', component: RezervacijaComponent, canActivate: [authGuard]},
    {path: 'tipObjekta', component: TipObjektaComponent, canActivate: [authGuard]},
    {path: 'uloga', component: UlogaComponent, canActivate: [authGuard]},
    {path: 'popust', component: PopustComponent, canActivate: [authGuard]},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'dashbord', component: DashboardComponent},
    {path: 'adminDashbord', component: AdminDashbordComponent, canActivate: [authGuard]},
    {path: 'vlasnikDashbord', component: VlasnikDashbordComponent, canActivate: [authGuard]},
    {path: 'korisnikDashbord', component: KorisnikDashbordComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' } // Podrazumevana ruta

];
