import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikDashbordComponent } from './vlasnik-dashbord.component';

describe('VlasnikDashbordComponent', () => {
  let component: VlasnikDashbordComponent;
  let fixture: ComponentFixture<VlasnikDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VlasnikDashbordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VlasnikDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
