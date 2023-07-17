import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  form: any = {
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,

  };
  isLoggedIn = false;
  isConfirmationFailed = false;
  errorMessage = '';
  successMessage = '';
  roles: string[] = [];
  userId: number;
  onDestroy$: Subject<boolean> = new Subject();

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.checkLogin();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  onSubmit(): void {
    const { oldPassword, newPassword, confirmPassword } = this.form;
    let inputs = { newPassword: newPassword, confirmPassword: confirmPassword, id: this.userId, oldPassword: oldPassword }
    this.authService
      .saveResetPassword(inputs)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        {
          next: (data) => {
            this.isConfirmationFailed = false;
            this.successMessage = data.message;
            window.setTimeout(() => this.successMessage = '', 4000);
          },
          error: (error) => {
            this.errorMessage = error.error.message;
            this.isConfirmationFailed = true;
            window.setTimeout(() => this.isConfirmationFailed = false, 4000);
          },
        });
  }

  private checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.userId = user.id;
    }
  }
}
