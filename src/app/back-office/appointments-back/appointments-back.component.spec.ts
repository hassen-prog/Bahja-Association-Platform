import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsBackComponent } from './appointments-back.component';

describe('AppointmentsBackComponent', () => {
  let component: AppointmentsBackComponent;
  let fixture: ComponentFixture<AppointmentsBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentsBackComponent]
    });
    fixture = TestBed.createComponent(AppointmentsBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
