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
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
    private _snackBar: MatSnackBar, private router: Router, private cookieService: CookieService
  ) { }

  checkLogin() {
    this.isLoggedIn = this.tokenStorage.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.username = user.username;
    }
  }

  onSubmit(): void {
    const { newPassword, confirmPassword } = this.form;
    console.log(this.cookieService.getAll().token);
    let token = this.cookieService.getAll().token;
    let inputs = { newPassword: newPassword, confirmPassword: confirmPassword, token: token }
    this.authService.saveForgotPassword(inputs).subscribe(
      {
        next: (response: any) => {
          this.cookieService.delete('token');
          this.changedSuccessfully = true;
        },
        error: (error) => {
          this.notification(error.error.message, "Close", "error-snackbar");
        },
      });
  }

  private notification(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 4000,
      panelClass: [className]
    });
  }
}
