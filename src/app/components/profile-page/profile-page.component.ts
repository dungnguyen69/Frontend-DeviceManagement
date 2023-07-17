import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import { USER } from 'src/assets/constant';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject();
  profileForm: FormGroup;
  submitted = false;
  USERNAME = 1;
  isLoggedIn = false;
  roles: string[] = [];
  isAdmin = false;
  isMod = false;
  isUser = false;
  username?: string;
  badgeId: string;
  readonly suggestionOptions: { [key: string]: any } = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  }
  columnIndex = USER;

  unfilteredPlatformVersionSuggestions = [];
  constructor(public fb: FormBuilder, private userService: UserService, private _snackBar: MatSnackBar,
    private tokenStorageService: TokenStorageService, private router: Router, private localService: LocalService) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      id: new FormControl(''),
      userName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      firstName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      lastName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required, Validators.email
      ])),
      phoneNumber: new FormControl('', Validators.compose([
        Validators.required
      ])),
      project: new FormControl('', Validators.compose([
        Validators.required
      ]))
    }, { updateOn: 'change' });
    this.checkLogin();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }


  onSubmit() {
    if (this.profileForm.valid) {
      this.userService
        .updateProfile(this.profileForm.value)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe
        (
          {
            next: (data: any) => {
              this.notification(data.message, 'Close', 'success-snackbar');
            },
            error: (error: any) => {
              this.notification(error.message, 'Close', 'success-snackbar');
            },
          }
        );
    }
  }

  private checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.isMod = this.roles.includes('ROLE_MODERATOR');
      this.isUser = this.roles.includes('ROLE_USER');
      this.username = user.username;
      this.badgeId = user.badgeId;
      this.profileForm.setValue({
        id: user.id,
        userName: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        project: user.project
      })
    }
  }

  private notification(message: string, action: string, className: string): void {
    this._snackBar.open(message, action, {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 6000,
      panelClass: [className]
    });
  }
}
