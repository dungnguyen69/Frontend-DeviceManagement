import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';
import { ADD_DEVICE } from 'src/app/utils/constant';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit {
  addDeviceForm: FormGroup;
  submitted = false;
  USERNAME = 1;
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
  columnIndex = ADD_DEVICE;

  unfilteredPlatformVersionSuggestions = [];
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<AddDeviceComponent>,
    private deviceService: DeviceService,
    private userService: UserService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.addDeviceForm = new FormGroup({
      deviceName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      statusId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      itemTypeId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      platformNameId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      platformId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      ramId: new FormControl('', Validators.compose([
        Validators.required, Validators.pattern("^[0-9]*$")
      ])),
      screenId: new FormControl('', Validators.compose([
        Validators.required, Validators.pattern("^[0-9]*$")
      ])),
      storageId: new FormControl('', Validators.compose([
        Validators.required, Validators.pattern("^[0-9]*$")
      ])),
      inventoryNumber: new FormControl('', Validators.compose([
        Validators.required, this.noWhitespaceValidator as ValidatorFn
      ])),
      serialNumber: new FormControl('', Validators.compose([
        Validators.required, this.noWhitespaceValidator as ValidatorFn
      ])),
      projectId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      comments: new FormControl(''),
      originId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      owner: new FormControl('', Validators.compose([
        Validators.required, this.noWhitespaceValidator as ValidatorFn
      ]))
    }, { updateOn: 'change' });

    this.addDeviceForm.controls["owner"].valueChanges
      .subscribe((value: string) => {
        if (value.trim().length != 0) {
          this.employeeSuggestion(this.USERNAME, value, true)
        }
        // else {
        //   this.ownerSuggestions = [];
        // }
      })

    this.fetchDropdownValuesIntoSuggestions();
  }

  fetchDropdownValuesIntoSuggestions(): void {
    this.deviceService.getDropDownValues().subscribe(
      {
        next: (response: any) => {
          this.suggestionOptions[ADD_DEVICE.PLATFORM_NAME] = [...new Set(response['platformList'].map((a: any) => a.name))];
          this.unfilteredPlatformVersionSuggestions = response['platformList'];
          this.suggestionOptions[ADD_DEVICE.RAM] = response['ramList'];
          this.suggestionOptions[ADD_DEVICE.SCREEN] = response['screenList'];
          this.suggestionOptions[ADD_DEVICE.STORAGE] = response['storageList'];
          this.suggestionOptions[ADD_DEVICE.STATUS] = response['statusList'];
          this.suggestionOptions[ADD_DEVICE.PROJECT] = response['projectList'];
          this.suggestionOptions[ADD_DEVICE.ORIGIN] = response['originList'];
          this.suggestionOptions[ADD_DEVICE.ITEM_TYPE] = response['itemTypeList'];
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getPlatformVersion(event: any): void {
    this.addDeviceForm.value.platformId = null;
    this.suggestionOptions[ADD_DEVICE.PLATFORM_VERSION] = this.unfilteredPlatformVersionSuggestions.filter((x: any) => x.name == event);
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (String(control.value) || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  onNoClick(): void {
    this.dialogRef.close({ event: "Cancel" });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addDeviceForm.valid) {
      delete this.addDeviceForm.value.platformNameId;
      this.deviceService.addDevice(this.addDeviceForm.value)
        .subscribe
        (
          {
            next: () => {
              this.dialogRef.close({ event: "Submit" });
            },
            error: (error: any) => {
              this.areSuggestionValuesValid(error.error);
            },
          }
        );
    }
  }

  //Check whether inputs whose tables are in the database match the database. 
  areSuggestionValuesValid(errors: any): void {
    let arr: string[] = [];
    if (errors.length >= 1) {
      errors.forEach((error: { message: string; }) => {
        arr.push("[" + error.message + "]");
      })
    }
    this.invalidNotification(arr);
  }

  invalidNotification(arr: string[]): void {
    let spots = arr.join("\r\n");
    let message = `${spots}`;
    this._snackBar.open(message, '', {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 10000,
      panelClass: ['error-snackbar']
    });
  }

  employeeSuggestion(column: number, keyword: string, isOwner: boolean): void {
    this.userService.suggest(column, keyword)
      .subscribe((data: any) => {
        if (isOwner)
          this.suggestionOptions[this.columnIndex.OWNER] = data['keywordList'];
      });
  }
}
