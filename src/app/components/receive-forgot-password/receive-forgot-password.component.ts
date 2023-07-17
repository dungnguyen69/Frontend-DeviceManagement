import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-receive-forgot-password',
  templateUrl: './receive-forgot-password.component.html',
  styleUrls: ['./receive-forgot-password.component.scss']
})
export class ReceiveForgotPasswordComponent implements OnInit, OnDestroy {
  form: any = {
    newPassword: null,
    confirmPassword: null
  };
  onDestroy$: Subject<boolean> = new Subject();
  isLoggedIn = false;
  username?: string;
  changedSuccessfully = false;
  errorMessage = '';
  isConfirmationFailed = false;
  token: any;
  status: string;

  constructor(private authService: AuthService, private cookieService: CookieService,
    private route: ActivatedRoute

  ) { }
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.authService.verifyPasswordToken(this.token).subscribe(
        data => {
          this.status = data.status;
        }
        ,
        err => {
          this.errorMessage = err.error.message;
        }
      );
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  onSubmit(): void {
    const { newPassword, confirmPassword } = this.form;
    this.token = this.route.snapshot.queryParamMap.get('token');
    let inputs = { newPassword: newPassword, confirmPassword: confirmPassword, token: this.token }
    this.authService
      .saveForgotPassword(inputs)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
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
