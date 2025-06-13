import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsViewComponent } from './kids-view.component';

describe('KidsViewComponent', () => {
  let component: KidsViewComponent;
  let fixture: ComponentFixture<KidsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidsViewComponent]
    });
    fixture = TestBed.createComponent(KidsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
