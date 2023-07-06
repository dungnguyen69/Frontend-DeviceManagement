import { Component, ViewChild } from '@angular/core';
import { BookingPageComponent } from '../booking-page/booking-page.component';
import { DeviceService } from 'src/app/services/device.service';
import { MatDialogRef } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-import-device',
  templateUrl: './import-device.component.html',
  styleUrls: ['./import-device.component.scss']
})
export class ImportDeviceComponent {

  fileName = null;
  errorMessage: string;
  fileUploaded: File;
  isLoading = false;
  @ViewChild(BookingPageComponent) bookingTable: BookingPageComponent;
  constructor(
    private importService: DeviceService,
    public dialogRef: MatDialogRef<ImportDeviceComponent>,
    private _snackBar: MatSnackBar) {
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

  downLoadFile(fileName: string, data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    saveAs(url, fileName)
  }

  onImportClick() {
    this.isLoading = true;
    let formData: FormData = new FormData();
    formData.append("file", this.fileUploaded);
    this.importService.importDevice(formData)
      .subscribe(response => {
        this.isLoading = false;
        this.fileName = null;
        this.notification("IMPORTED SUCCESSFULLY", "success-snackbar");
        this.dialogRef.close({ event: "accept" });
      }, error => {
        this.isLoading = false;
        console.log(error.error.message);
        
        this.errorMessage = "[ERROR] Import error please try again";
        this.notification(error.error.message, "error-snackbar")
      });
  }

  formatNumber(number: any) {
    if (number < 10) {
      return '0' + number;
    }
    else
      return number;
  }

  notification(message: string, className: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 4000,
      panelClass: [className]
    });
  }
}
