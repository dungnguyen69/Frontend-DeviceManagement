import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: any = {
    userName: null,
    password: null,
    matchingPassword: null,
    email: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
  };
  onDestroy$: Subject<boolean> = new Subject();

  isRegister = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  onSubmit(): void {
    this.authService
      .register(this.form)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          this.isLoginFailed = false;
          this.isRegister = true;
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
  }
}
