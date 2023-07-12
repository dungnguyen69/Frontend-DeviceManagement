import { Component, OnInit, ViewChild } from '@angular/core';
import { BookingPageComponent } from '../booking-page/booking-page.component';
import { DeviceService } from 'src/app/services/device.service';
import { MatDialogRef } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-import-device',
  templateUrl: './import-device.component.html',
  styleUrls: ['./import-device.component.scss']
})
export class ImportDeviceComponent implements OnInit {

  fileName = null;
  errorMessage: string;
  fileUploaded: File;
  isLoading = false;
  userId: number;
  rowIndex: number = 0;
  roles: string[] = [];
  isLoggedIn = false;

  @ViewChild(BookingPageComponent) bookingTable: BookingPageComponent;
  constructor(
    private importService: DeviceService,
    public dialogRef: MatDialogRef<ImportDeviceComponent>,
    private _snackBar: MatSnackBar, private tokenStorageService: TokenStorageService) {
  }
  ngOnInit(): void {
    this.checkLogin();
  }

  onTemplateFileClick() {
    this.importService.getTemplateImportDevice()
      .subscribe(response => {
        this.downLoadFile("Template_Import_Device.xlsx", response, "application/ms-excel");
      })
  }

  onFileSelected(event: any) {
    let file = event.target.files;
    let fileType = file[0].type;
    if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.fileName = file[0].name;
      this.fileUploaded = file[0];
      this.errorMessage = "";
    }
    else {
      this.errorMessage = '[ERROR] Only have excel file (.xlsx)'
    }

  }

  onFileDropped(file: any) {
    let fileType = file[0].type;
    if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.fileName = file[0].name;
      this.fileUploaded = file[0];
      this.errorMessage = "";
    }
    else {
      this.errorMessage = '[ERROR] Only have excel file (.xlsx)';
    }

  }

  onImportClick() {
    this.isLoading = true;
    let formData: FormData = new FormData();
    formData.append("file", this.fileUploaded);
    this.importService.importDevice(this.userId, formData)
      .subscribe(
        {
          next: () => {
            this.isLoading = false;
            this.fileName = null;
            this.notification("IMPORTED SUCCESSFULLY", 'Close', "success-snackbar");
            this.dialogRef.close({ event: "accept" });
          }, error: (error) => {
            this.isLoading = false;
            this.areSuggestionValuesValid(error.error.errors)
          }
        });

  }

  private areSuggestionValuesValid(errors: any): void {
    let arr: string[] = [];
    errors.forEach((error: string) => {
      arr.push("[" + error + "]");
    })
    let spots = arr.join("\r\n");
    let message = `${spots}`;
    this.notification(message, 'Close', "error-snackbar");
  }

  private downLoadFile(fileName: string, data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    saveAs(url, fileName)
  }

  private notification(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 4000,
      panelClass: [className]
    });
  }

  private checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.userId = user.id;
    }
  }
}
