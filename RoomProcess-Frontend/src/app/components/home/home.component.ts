import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
//Ovo je bitno za ngModule da moze da se koristi !!
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  cityQuery: string = '';
  objectNameQuery: string = '';

  constructor(private htpp: HttpClient,
              private router: Router,
  ){

  }

  onSearch(): void {
    if (this.cityQuery.trim() !== '' && this.objectNameQuery.trim() !== '') {
      // Pretraga po gradu i nazivu objekta
      this.router.navigate(['/dashbord'], { queryParams: { city: this.cityQuery, objectName: this.objectNameQuery } });
    } else if (this.cityQuery.trim() !== '') {
      // Pretraga samo po gradu
      this.router.navigate(['/dashbord'], { queryParams: { city: this.cityQuery } });
    } else if (this.objectNameQuery.trim() !== '') {
      // Pretraga samo po nazivu objekta
      this.router.navigate(['/dashbord'], { queryParams: { objectName: this.objectNameQuery } });
    }
  }

}
