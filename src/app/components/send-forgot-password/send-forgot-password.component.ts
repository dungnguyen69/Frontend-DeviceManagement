import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-send-forgot-password',
  templateUrl: './send-forgot-password.component.html',
  styleUrls: ['./send-forgot-password.component.scss']
})
export class SendForgotPasswordComponent implements OnInit {
  form: any = {
    email: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  sentSuccesfull = false;
  isSubmitted: boolean;
  isConfirmationFailed = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    const { email } = this.form;
    this.sentSuccesfull = false;
    this.isSubmitted = true;
    this.authService.forgotPassword(email).subscribe(
      {
        next: () => {
          this.sentSuccesfull = true;
          this.isConfirmationFailed = false;
        },
        error: (error) => {
          this.isSubmitted = false;
          this.errorMessage = error.error.message;
          this.isConfirmationFailed = true;
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
