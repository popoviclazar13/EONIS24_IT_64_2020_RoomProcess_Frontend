import { Component, NgModule, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { KorisnikComponent } from './components/main/korisnik/korisnik.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { routes } from './app.routes';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/*@NgModule({
    declarations: [
      //KorisnikComponent,
    ],
    imports: [
        BrowserModule,
        //Materials
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,


        //Rutiranje
        RouterModule,
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule], //Za rutiranje
  })
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet],
  styleUrl: './app.component.css',
  standalone: true // Add this line
})
export class AppComponent {
  title = 'RoomProcess-Frontend';
}
