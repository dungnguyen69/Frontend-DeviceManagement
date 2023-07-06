import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittingPageComponent } from './submitting-page.component';

describe('SubmittingPageComponent', () => {
  let component: SubmittingPageComponent;
  let fixture: ComponentFixture<SubmittingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmittingPageComponent]
    });
    fixture = TestBed.createComponent(SubmittingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
