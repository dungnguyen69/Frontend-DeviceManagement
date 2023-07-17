import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-receive-email-verification',
  templateUrl: './receive-email-verification.component.html',
  styleUrls: ['./receive-email-verification.component.scss']
})
export class ReceiveEmailVerificationComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject();
  isLoggedIn = false;
  username?: string;
  changedSuccessfully = false;
  errorMessage = '';
  isConfirmationFailed = false;

  token: any;
  status: string;

  constructor(private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.authService.verifyToken(this.token).subscribe(
        data => {
          console.log(data);
          
          this.status = data.status;
        }
        ,
        err => {
          this.status = err.error.status;
          this.errorMessage = err.error.message;
        }
      );
    }
  }

  resendToken(): void {
    this.status = "SENDING";
    this.authService.resendToken(this.token).subscribe(
      data => {
        this.status = "SENT";
      }
      ,
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
}
