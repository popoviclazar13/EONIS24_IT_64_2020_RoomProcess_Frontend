import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UlogaComponent } from './uloga.component';

describe('UlogaComponent', () => {
  let component: UlogaComponent;
  let fixture: ComponentFixture<UlogaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UlogaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UlogaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
