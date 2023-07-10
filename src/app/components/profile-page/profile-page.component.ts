import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/services/local.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import { USER } from 'src/app/utils/constant';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  profileForm: FormGroup;
  submitted = false;
  USERNAME = 1;
  isLoggedIn = false;
  roles: string[] = [];
  isAdmin = false;
  isMod = false;
  isUser = false;
  username?: string;
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
      badgeId: new FormControl('', Validators.compose([
        Validators.required
      ])),
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
        Validators.required
      ])),
      phoneNumber: new FormControl('', Validators.compose([
        Validators.required
      ])),
      project: new FormControl('', Validators.compose([
        Validators.required
      ]))
    }, { updateOn: 'change' });

    // this.profileForm.controls["owner"].valueChanges
    //   .subscribe((value: string) => {
    //     if (value.trim().length != 0) {
    //       this.employeeSuggestion(this.USERNAME, value, true)
    //     }
    //     // else {
    //     //   this.ownerSuggestions = [];
    //     // }
    //   })

    // this.fetchDropdownValuesIntoSuggestions();
    this.checkLogin();
  }

  onSubmit() { }

  checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.isMod = this.roles.includes('ROLE_MODERATOR');
      this.isUser = this.roles.includes('ROLE_USER');
      this.username = user.username;
      console.log(user);
      

      this.profileForm.setValue({
        badgeId: user.badgeId,
        userName: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        project: user.project
      })
    }
  }
}
