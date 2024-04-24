import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UlogaDialogComponent } from './uloga-dialog.component';

describe('UlogaDialogComponent', () => {
  let component: UlogaDialogComponent;
  let fixture: ComponentFixture<UlogaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UlogaDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UlogaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
