import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-receive-forgot-password',
  templateUrl: './receive-forgot-password.component.html',
  styleUrls: ['./receive-forgot-password.component.scss']
})
export class ReceiveForgotPasswordComponent {
  form: any = {
    newPassword: null,
    confirmPassword: null
  };
  isLoggedIn = false;
  username?: string;
  changedSuccessfully = false;
  errorMessage = '';
  isConfirmationFailed = false;

  constructor(private authService: AuthService, private cookieService: CookieService
  ) { }

  onSubmit(): void {
    const { newPassword, confirmPassword } = this.form;
    let token = this.cookieService.getAll().token;
    let inputs = { newPassword: newPassword, confirmPassword: confirmPassword, token: token }
    this.authService.saveForgotPassword(inputs).subscribe(
      {
        next: () => {
          this.cookieService.delete('token');
          this.changedSuccessfully = true;
          this.isConfirmationFailed = false;
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          this.isConfirmationFailed = true;
        },
      });
  }
}
