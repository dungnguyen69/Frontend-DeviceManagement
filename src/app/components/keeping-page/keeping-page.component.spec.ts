import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepingPageComponent } from './keeping-page.component';

describe('KeepingPageComponent', () => {
  let component: KeepingPageComponent;
  let fixture: ComponentFixture<KeepingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeepingPageComponent]
    });
    fixture = TestBed.createComponent(KeepingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
