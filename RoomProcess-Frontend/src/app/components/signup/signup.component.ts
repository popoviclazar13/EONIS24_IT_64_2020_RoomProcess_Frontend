import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, MatIconModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  registerObj: any = {
    ime: '',
    prezime: '',
    email: '',
    password: '',
    ulogaId: 3 // svaki korisnik koji se registruje je User
  }

  constructor(private http: HttpClient,
    private router: Router
  ) {
  }

  onSignUp(){
    this.http.post('https://localhost:7047/api/korisnik/Register', this.registerObj).subscribe((res: any )=>{ // stavili URL sa backenda kopiran i prosledili objekat 
      if(res.message == `Successfully registered User ${this.registerObj.ime}`){ // poredimo sa backenda poruku koja se dobija kada je korisnik uspesno registrovan
        alert("Register success")
        localStorage.setItem('angular17token', res.transferObject); //ovako cuvamo token u localStorage
        //Nalzi se u inspect->Application->local storage->http localhost4200
        
        this.router.navigateByUrl('/home');
      }else{
        alert(res.message)
      }
    })
  }

}
