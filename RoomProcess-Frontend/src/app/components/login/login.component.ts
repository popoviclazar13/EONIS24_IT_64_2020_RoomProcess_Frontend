import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthServiceService } from '../../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: any = {
    email: '',
    password: ''
  }

  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthServiceService // Inject AuthService
  ) {
  }

  onLogin(){

    this.http.post('https://localhost:7047/api/korisnik/Login', this.loginObj).subscribe((res: any )=>{ // stavili URL sa backenda kopiran i prosledili objekat 
      if(res.message == "You logged in successfully"){ // poredimo sa backenda poruku koja se dobija kada je korisnik uspesno ulogovan
        alert("Login success")
        this.authService.login(res.name, res.transferObject, res.role, res.korisnikID);//Ovo je dodato zbog AuthServisa da znamo ko je ulogovan
        localStorage.setItem('angular17token', res.transferObject); //ovako cuvamo token u localStorage
        localStorage.setItem('ulogaId', res.role); //ovako cuvamo ulogu u localStorage
        localStorage.setItem('user', res.name); //ovako cuvamo ime u localStorage
        localStorage.setItem('korisnikId', res.korisnikID); // ovako cuvamo korisnikID
        //Nalzi se u inspect->Application->local storage->http localhost4200

        if(res.role == 1){
          this.router.navigateByUrl('/adminDashbord');
        }else if(res.role == 2){
          this.router.navigateByUrl('/vlasnikDashbord');
        }
        else{
          this.router.navigateByUrl('/dashbord');
        }
        
      }else{
        alert(res.message)
      }
    })
  }
}
