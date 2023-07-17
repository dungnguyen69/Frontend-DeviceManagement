import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-provide-permission',
  templateUrl: './provide-permission.component.html',
  styleUrls: ['./provide-permission.component.scss']
})
export class ProvidePermissionComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject();
  permissions: FormGroup;
  selected = '';
  username: string;
  roles: string[] = [];
  isLoggedIn = false;
  isAdmin = false;
  isMod = false;
  isUser = false;
  row: any;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ProvidePermissionComponent>,
    private _snackBar: MatSnackBar, private tokenStorageService: TokenStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService) {
    this.row = data.dataKey;
  }

  ngOnInit(): void {
    this.permissions = this.fb.group({
      ADMINISTRATOR: [false, [Validators.required]],
      MODERATOR: [false, [Validators.required]],
      USER: [false, [Validators.required]],
    });
    this.roles = this.row.systemRoles;
    this.isAdmin = this.roles.includes('ROLE_ADMIN');
    this.isMod = this.roles.includes('ROLE_MODERATOR');
    this.isUser = this.roles.includes('ROLE_USER');
    this.checkLogin();
    this.setInitialPermission();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  disableOthers(controlName: string) {
    Object.keys(this.permissions.controls).forEach((key) => {
      if (key !== controlName) this.permissions.get(key)?.setValue(false);
    });
  }

  onSubmit() {
    let test: string | undefined;
    const userId = this.row.id;
    if (this.permissions.controls['ADMINISTRATOR'].value) {
      test = "ROLE_ADMIN";
    }
    if (this.permissions.controls['MODERATOR'].value) {
      test = "ROLE_MODERATOR";
    }
    if (this.permissions.controls['USER'].value) {
      test = "ROLE_USER";
    }
    if (test == undefined) {
      this.notification('Please choose one of checkboxes', "Close", "error-snackbar");
      return;
    }
    this.userService
      .providePermission(userId, test)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.notification(`Updated ${this.roles[0]} to ${test} successfully`, "Close", "success-snackbar");
        }
      });
  }

  private checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
    }
  }

  private setInitialPermission() {
    this.permissions.setValue({
      ADMINISTRATOR: this.isAdmin,
      MODERATOR: this.isMod,
      USER: this.isUser
    })
  }

  private notification(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 6000,
      panelClass: [className]
    });
  }
}
