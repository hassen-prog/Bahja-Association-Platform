import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoringPageComponent } from './coloring-page.component';

describe('ColoringPageComponent', () => {
  let component: ColoringPageComponent;
  let fixture: ComponentFixture<ColoringPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColoringPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColoringPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
