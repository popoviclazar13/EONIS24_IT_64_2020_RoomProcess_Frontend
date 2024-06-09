import { ObjekatService } from './../../../services/objekat.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../../services/auth-service.service';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Objekat } from '../../../models/objekat';
import { TipObjektaService } from '../../../services/tipObjekta.service';
import { TipObjekta } from '../../../models/tipObjekta';
import { PopustService } from '../../../services/popust.service';
import { Popust } from '../../../models/popust';
import { RecenzijaService } from '../../../services/recenzija.service';
import { Recenzija } from '../../../models/recenzija';
import { Rezervacija } from '../../../models/rezervacija';
import { RezervacijaService } from '../../../services/rezervacija.service';
import { ReservationDialogComponent } from '../dialogs/reservation-dialog/reservation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Oprema } from '../../../models/oprema';
import { OpremaService } from '../../../services/oprema.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashboardComponent implements OnInit {

  userName: string = '';
  subscription!: Subscription;
  dataSource: Objekat[] = []; // Skladištenje podataka u nizu
  tipObjekta: TipObjekta[] = [];
  popusti: Popust[] = [];
  recenzije: Recenzija[] = [];
  rezervacije: Rezervacija[] = [];
  opremaMap: { [key: number]: Oprema[] } = {};

  minValue!: number | null;
  maxValue!: number | null;

  //selectedTipObjektaId: number = 0; // skladistenje koji tip objekta je chekiran
  //selectedPopustId: number = 0; // skladistenje koji popust je chekiran

  selectedId: { type: string, id: number } = { type: '', id: 0 };

  lokacijaChecked: boolean = false; // Promenljiva koja prati da li je checkbox Lokacija označen
  osobljeChecked: boolean = false;
  sadrzajChecked: boolean = false;
  cistocaChecked: boolean = false;
  odnosCiKChecked: boolean = false;
  ratings: number[] = Array.from({length: 10}, (_, i) => i + 1); // Lista ocena od 1 do 10

  constructor(private authService: AuthServiceService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private objekatService: ObjekatService,
    private tipObjektaService: TipObjektaService,
    private popustService: PopustService,
    private recenzijaService: RecenzijaService,
    private rezervacijaService: RezervacijaService,
    private opremaService: OpremaService 
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.loadData(); 
    this.loadTipObjekta();
    this.loadPopust();
    this.loadRecenzija();
    this.loadRezervacije();

    //mora na kraju posto ako bude na pocetku, kasnije se poziva loadData koji ce pregaziti podatke!!!
    this.route.queryParams.subscribe(params => {
      const city = params['city'];
      const objectName = params['objectName'];
      const query = params['query'];
      const type = params['type'];
      const id = params['id'];
      console.log('Query Params:', params);  // Dodajte ovo
      if (type && id) {
        this.selectedId = { type, id: +id };
        console.log('Selected ID:', this.selectedId);  // I ovo
        this.onRadioChange();
      }
      if (city) {
        debugger
        // Ako je upit definisan, pretrazi objekte na osnovu upita
        this.searchObjects(city);
      } else if (objectName){
        debugger
        this.searchObjectsByName(objectName);
      }
    });

  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.userName = '';
    this.router.navigateByUrl('/home');
  }

  public loadData() {
    this.subscription = this.objekatService.getAllObjekat().subscribe(
      (data) => {
        this.dataSource = data;
        this.loadOpremaForAllObjekti(); // mora ovde posto iz nekog razloga ne hvata lepo duzinu dataSourca ako se stavi u OnInit
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  public loadRezervacije() {
    this.subscription = this.rezervacijaService.getAllRezervacija().subscribe(
      (data) => {
        this.rezervacije = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  public loadRecenzija() {
    this.subscription = this.recenzijaService.getAllRecenzija().subscribe(
      (data) => {
        this.recenzije = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  public getOcenaRecenzije(objekatId: number): string {
    debugger;
    const relevantRezervacije = this.rezervacije.filter(r => r.objekatId === objekatId);
    const relevantRecenzije = this.recenzije.filter(rec => 
      relevantRezervacije.some(rez => rez.rezervacijaId === rec.rezervacijaId)
    );
    console.log(this.rezervacije.filter(r => r.objekatId === objekatId));
    console.log('Relevantne rezervacije:', relevantRezervacije);
  console.log('Relevantne recenzije:', relevantRecenzije);
    if (relevantRecenzije.length > 0) {
      const sumaOcena = relevantRecenzije.reduce((sum, r) => sum + r.ocena, 0);
      const prosekOcena = sumaOcena / relevantRecenzije.length;
      console.log('Prosečna ocena:', prosekOcena);
      return prosekOcena.toFixed(2);
    } else {
      return 'Nema ostavljenih recenzija!';
    }
  }

  public loadTipObjekta() {
    this.subscription = this.tipObjektaService.getAllTipObjekta().subscribe(
      (data) => {
        this.tipObjekta = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  public loadPopust() {
    this.subscription = this.popustService.getAllPopust().subscribe(
      (data) => {
        this.popusti = data;
      },
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  onRadioChange(): void {
    debugger
    if (this.selectedId.type === 'tipObjekta') {
      this.subscription = this.objekatService.getObjekatByTipObjekta(this.selectedId.id).subscribe(
        (data) => {
          console.log(this.selectedId.id);
          this.dataSource = data;
          console.log(data);
        },
        (error: Error) => {
          console.log(error.name + ' ' + error.message);
        }
      );
    } else if (this.selectedId.type === 'popust') {
      this.subscription = this.objekatService.getObjekatByPopust(this.selectedId.id).subscribe(
        (data) => {
          console.log(this.selectedId.id);
          this.dataSource = data;
        },
        (error: Error) => {
          console.log(error.name + ' ' + error.message);
        }
      );
    }
  }

  searchObjects(query: string): void {
    // Pozovite servis za pretragu objekata na osnovu upita
    this.objekatService.getObjekatByGrad(query).subscribe(
      (data: Objekat[]) => {
        // Ažurirajte dataSource sa dobijenim podacima
        this.dataSource = data;
        console.log(data);
      },
      (error: any) => {
        console.error('Error searching objects:', error);
      }
    );
  }
  searchObjectsByName(query: string): void {
    this.objekatService.getObjekatByNaziv(query).subscribe(
      (data: any) => {
        // Proverite da li je data niz
        if (Array.isArray(data)) {
          this.dataSource = data;
        } else {
          // Ako nije niz, konvertujte ga u niz
          this.dataSource = [data];
        }
        console.log(this.dataSource);
      },
      (error: any) => {
        console.error('Error searching objects:', error);
      }
    );
  }

  resetFilters(): void {
    // Postavite vrednosti promenljivih koje prate stanje filtera na početne vrednosti
    this.selectedId = { type: '', id: 0 };
    this.lokacijaChecked = false;
    this.cistocaChecked = false;
    this.osobljeChecked = false;
    this.sadrzajChecked = false;
    this.odnosCiKChecked = false;

    //Za cene
    this.maxValue = null;
    this.minValue = null;

    //Ovo je takodje potrebno
    setTimeout(() => {
      const radioButtons = document.querySelectorAll('input[name="tipObjektaRadio"]');
      radioButtons.forEach((radio) => {
        (radio as HTMLInputElement).checked = false;
      });
  
      const discountRadioButtons = document.querySelectorAll('input[name="popustRadio"]');
      discountRadioButtons.forEach((radio) => {
        (radio as HTMLInputElement).checked = false;
      });
    });
    //
  
    // Ponovo učitajte podatke
    this.loadData();
  }

  rezervisi(objekatId: number): void {
    const selectedObjekat = this.dataSource.find(objekat => objekat.objekatId === objekatId);
    if (selectedObjekat) {
      const dialogRef = this.dialog.open(ReservationDialogComponent, {
        width: '400px',
        data: { objekat: selectedObjekat, startDate: null, endDate: null }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // Ako želite da uradite nešto nakon zatvaranja dijaloga
      });
    }
  }

  user(){
    this.router.navigateByUrl('/korisnikDashbord');
  }

  filterByPriceRange(): void {
    debugger
    if (this.minValue != null && this.maxValue != null) {
      this.objekatService.getObjekatByPriceRange(this.minValue, this.maxValue).subscribe(
        (data) => {
          this.dataSource = data;
        },
        (error: Error) => {
          console.log(error.name + ' ' + error.message);
        }
      );
    }
  }

  private loadOpremaForAllObjekti() {
    this.dataSource.forEach(objekat => {
      this.opremaService.getOpremaByObjekat(objekat.objekatId).subscribe(
        (data) => {
          this.opremaMap[objekat.objekatId] = data;
          console.log(this.opremaMap)
        },
        (error: Error) => {
          if (error.message.includes('404')) {
            console.log(`Objekat sa ID ${objekat.objekatId} trenutno nema nikakvu opremu!`);
          } else {
            console.log(error.name + ' ' + error.message);
          }
        }
      );
    });
  }

  getOpremaZaObjekat(objekatId: number): Oprema[] {
    return this.opremaMap[objekatId] || [];
  }

}
