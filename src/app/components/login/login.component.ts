import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

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
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe(
      data => {
        console.log(data);
        
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.notification(this.errorMessage, "error-snackbar")
        this.isLoginFailed = true;
      }
    );
  }

  private reloadPage(): void {
    window.location.reload();
  }

  private notification(message: string, className: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 4000,
      panelClass: [className]
    });
  }
}
