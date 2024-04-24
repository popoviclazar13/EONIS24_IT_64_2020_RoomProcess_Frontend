import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipObjektaComponent } from './tip-objekta.component';

describe('TipObjektaComponent', () => {
  let component: TipObjektaComponent;
  let fixture: ComponentFixture<TipObjektaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipObjektaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipObjektaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
