import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingPageComponent } from '../booking-page/booking-page.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceService } from 'src/app/services/device.service';
import { SelectionModel } from '@angular/cdk/collections';
import { saveAs } from 'file-saver';
import { LocalService } from 'src/app/services/local.service';
import { SubmittingPageComponent } from '../submitting-page/submitting-page.component';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  @ViewChild(BookingPageComponent) bookingPage: BookingPageComponent;
  selectedDevices = new SelectionModel();
  addSuccessful: string;
  addUnsuccessful: string;
  errorMessage: string;
  totalBookingDevices: number = 0;
  roles: string[] = [];
  isLoggedIn = false;
  isAdmin = false;
  isMod = false;
  isUser = false;

  username?: string;

  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar,
    private deviceService: DeviceService, private localStore: LocalService,
    private tokenStorageService: TokenStorageService, private authService: AuthService) { }
  ngOnInit(): void {
    this.countDevices();
    this.checkLogin();
  }

  checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.isMod = this.roles.includes('ROLE_MODERATOR');
      this.isUser = this.roles.includes('ROLE_USER');
      this.username = user.username;
    }
  }

  exportDevice() {
    this.deviceService.exportDevice().subscribe((data: any) => {
      let datetime = new Date()
      let currentTime = (datetime.getFullYear() + '-' +
        this.formatNumber(datetime.getMonth() + 1) + '-' +
        this.formatNumber(datetime.getDate()) + ' ' +
        this.formatNumber(datetime.getHours()) + '-' +
        this.formatNumber(datetime.getMinutes()) + '-' +
        this.formatNumber(datetime.getSeconds())).toString();
      let exportDate = "Export_File_" + currentTime + ".xlsx";
      this.downLoadFile(exportDate, data, "application/ms-excel");
    }
    )
  }

  submitting() {
    const dialogRef = this.dialog.open(SubmittingPageComponent, {});
    dialogRef.componentInstance.recount.subscribe((data) => {
      this.countDevices();
    })
    dialogRef.afterClosed().subscribe(
      {
        next: (result: any) => {
          if (result?.event == "accept") {
          }
        },
        error: () => {
          this.errorMessage = "[ERROR] Import error please try again";
          this.notification(this.errorMessage, 'Close', "error-snackbar")
        }
      }
    );
  }

  countDevices() {
    this.totalBookingDevices = this.localStore.countKeys();
  }

  private downLoadFile(fileName: string, data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    saveAs(url, fileName)
  }

  private formatNumber(number: any) {
    if (number < 10) {
      return '0' + number;
    }
    else
      return number;
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
