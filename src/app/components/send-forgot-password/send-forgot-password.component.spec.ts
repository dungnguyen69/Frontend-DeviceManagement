import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendForgotPasswordComponent } from './send-forgot-password.component';

describe('SendForgotPasswordComponent', () => {
  let component: SendForgotPasswordComponent;
  let fixture: ComponentFixture<SendForgotPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendForgotPasswordComponent]
    });
    fixture = TestBed.createComponent(SendForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
