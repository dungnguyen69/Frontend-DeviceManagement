import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveForgotPasswordComponent } from './receive-forgot-password.component';

describe('ReceiveForgotPasswordComponent', () => {
  let component: ReceiveForgotPasswordComponent;
  let fixture: ComponentFixture<ReceiveForgotPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiveForgotPasswordComponent]
    });
    fixture = TestBed.createComponent(ReceiveForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
