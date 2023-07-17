import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveEmailVerificationComponent } from './receive-email-verification.component';

describe('ReceiveEmailVerificationComponent', () => {
  let component: ReceiveEmailVerificationComponent;
  let fixture: ComponentFixture<ReceiveEmailVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiveEmailVerificationComponent]
    });
    fixture = TestBed.createComponent(ReceiveEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
