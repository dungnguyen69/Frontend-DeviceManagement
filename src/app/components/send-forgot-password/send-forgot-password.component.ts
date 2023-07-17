import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-send-forgot-password',
  templateUrl: './send-forgot-password.component.html',
  styleUrls: ['./send-forgot-password.component.scss']
})
export class SendForgotPasswordComponent implements OnInit, OnDestroy {
  form: any = {
    email: null,
  };
  onDestroy$: Subject<boolean> = new Subject();
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

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  onSubmit(): void {
    const { email } = this.form;
    this.sentSuccesfull = false;
    this.isSubmitted = true;
    this.authService
      .forgotPassword(email)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
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
}
