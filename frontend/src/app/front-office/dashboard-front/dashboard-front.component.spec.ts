import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFrontComponent } from './dashboard-front.component';

describe('DashboardFrontComponent', () => {
  let component: DashboardFrontComponent;
  let fixture: ComponentFixture<DashboardFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardFrontComponent]
    });
    fixture = TestBed.createComponent(DashboardFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
