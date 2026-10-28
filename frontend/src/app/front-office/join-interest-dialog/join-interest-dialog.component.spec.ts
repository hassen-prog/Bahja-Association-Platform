import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinInterestDialogComponent } from './join-interest-dialog.component';

describe('JoinInterestDialogComponent', () => {
  let component: JoinInterestDialogComponent;
  let fixture: ComponentFixture<JoinInterestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinInterestDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinInterestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
