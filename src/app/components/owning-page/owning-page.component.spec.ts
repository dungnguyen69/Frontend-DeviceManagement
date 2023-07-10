import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwningPageComponent } from './owning-page.component';

describe('OwningPageComponent', () => {
  let component: OwningPageComponent;
  let fixture: ComponentFixture<OwningPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwningPageComponent]
    });
    fixture = TestBed.createComponent(OwningPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
