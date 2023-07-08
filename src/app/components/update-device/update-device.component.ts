import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';
import { ADD_DEVICE } from 'src/app/utils/constant';

@Component({
  selector: 'app-update-device',
  templateUrl: './update-device.component.html',
  styleUrls: ['./update-device.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateDeviceComponent implements OnInit {
  addDeviceForm: FormGroup;
  submitted = false;
  readOnly: boolean;
  USERNAME = 1;
  isStatusOccupied: boolean;
  OCCUPIED = "2";
  rowId: number;
  deviceIndex: number
  columnIndex = ADD_DEVICE;
  unfilteredPlatformVersionSuggestions: any = [];

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

  detailDevice: { [key: string]: string } = {
    name: '', statusId: '', platformId: '',
    itemTypeId: '', ramId: '', screenId: '', storageId: '', owner: '',
    keeper: '', inventoryNumber: '', serialNumber: '', originId: '', projectId: '', bookingDate: '', returnDate: '', comments: ''
  };

  occupiedDevice: { [key: string]: string } = {
    name: '', status: '', platformName: '', platformVersion: '',
    itemType: '', ram: '', screen: '', storage: '', owner: '',
    keeper: '', inventoryNumber: '', serialNumber: '', origin: '', project: '', bookingDate: '', returnDate: '', comments: ''
  };

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UpdateDeviceComponent>,
    private deviceService: DeviceService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.rowId = data.dataKey;
    this.deviceIndex = data.index;
    this.readOnly = data.readOnly;
  }

  ngOnInit() {
    this.addDeviceForm = new FormGroup({
      id: new FormControl('', Validators.compose([
        Validators.required
      ])),
      name: new FormControl('', Validators.compose([
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
      ])),
      keeper: new FormControl('', Validators.compose([
        Validators.required, this.noWhitespaceValidator as ValidatorFn
      ])),
      bookingDate: new FormControl(''),
      returnDate: new FormControl('')
    }, { updateOn: 'change' });

    this.addDeviceForm.controls["owner"].valueChanges
      .subscribe((value: string) => {
        if (value.trim().length != 0) {
          console.log(value);
          this.usersSuggestion(this.USERNAME, value, true)

        }
        // else {
        //   this.ownerSuggestions = [];
        // }
      })

    this.getDetailDevice(this.rowId);

  }

  getPlatformVersion(event: any): void {
    this.suggestionOptions[ADD_DEVICE.PLATFORM_VERSION] = this.unfilteredPlatformVersionSuggestions.filter((x: any) => x.name == event);
  }

  getDetailDevice(rowId: number) {
    this.fetchDropdownValuesIntoSuggestions();
    this.deviceService.getDetailDevice(rowId)
      .subscribe((data: any) => {
        this.addDeviceForm.setValue({
          id: data['detailDevice'].id,
          name: data['detailDevice'].name,
          statusId: data['detailDevice'].statusId,
          itemTypeId: data['detailDevice'].itemTypeId,
          platformId: data['detailDevice'].platformId,
          platformNameId: this.unfilteredPlatformVersionSuggestions.find((platform: any) => platform.id == data['detailDevice'].platformId).name,
          ramId: data['detailDevice'].ramId,
          screenId: data['detailDevice'].screenId,
          storageId: data['detailDevice'].storageId,
          inventoryNumber: data['detailDevice'].inventoryNumber,
          serialNumber: data['detailDevice'].serialNumber,
          projectId: data['detailDevice'].projectId,
          comments: data['detailDevice'].comments,
          originId: data['detailDevice'].originId,
          owner: data['detailDevice'].owner,
          keeper: data['detailDevice'].keeper,
          bookingDate: data['detailDevice'].bookingDate,
          returnDate: data['detailDevice'].returnDate
        })
        if (data['detailDevice'].statusId == "2" || this.readOnly) {
          this.isStatusOccupied = true;
          this.getOccupiedDevice();
        }

        let getPlatform: any = Object.values(this.unfilteredPlatformVersionSuggestions).filter((x: any) => x.id == data['detailDevice'].platformId)[0];
        this.getPlatformVersion(getPlatform.name);
      });
  }


  onNoClick(): void {
    this.dialogRef.close({ event: "Cancel" });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addDeviceForm.valid) {
      delete this.addDeviceForm.value.platformNameId;
      this.deviceService.updateDevice(this.rowId, this.addDeviceForm.value)
        .subscribe
        (
          {
            next: () => {
              this.dialogRef.close({ event: "Submit" });
              this.notification("UPDATED SUCCESSFULLY", 'success-snackbar');
            },
            error: (error: any) => {
              this.areSuggestionValuesValid(error.error);
            },
          }
        );
    }
  }

  //Check whether inputs whose tables are in the database match the database. 
  private areSuggestionValuesValid(errors: any): void {
    let arr: string[] = [];
    if (errors.length >= 1) {
      errors.forEach((error: { message: string; }) => {
        arr.push("[" + error.message + "]");
      })
    }
    let spots = arr.join("\r\n");
    let message = `${spots}`;
    this.notification(message, 'error-snackbar');
  }

  private notification(message: string, className: string): void {
    this._snackBar.open(message, '', {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 6000,
      panelClass: [className]
    });
  }

  private usersSuggestion(column: number, keyword: string, isOwner: boolean): void {
    this.userService.suggest(column, keyword)
      .subscribe((data: any) => {
        if (isOwner)
          this.suggestionOptions[this.columnIndex.OWNER] = data['keywordList'];
      });
  }

  private noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (String(control.value) || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  private getOccupiedDevice() {
    this.occupiedDevice.name = this.detailDevice.name;
    this.occupiedDevice.itemType = this.suggestionOptions[ADD_DEVICE.ITEM_TYPE].find((item: any) => item.id == this.addDeviceForm.value.itemTypeId).name;
    if (this.readOnly)
      this.occupiedDevice.status = this.suggestionOptions[ADD_DEVICE.STATUS].find((item: any) => item.id == this.addDeviceForm.value.statusId).status;
    else if (this.addDeviceForm.value.statusId == "2")
      this.occupiedDevice.status = "OCCUPIED";
    this.occupiedDevice.platformName = this.unfilteredPlatformVersionSuggestions.find((platform: any) => platform.id == this.addDeviceForm.value.platformId).name;
    this.occupiedDevice.platformVersion = this.unfilteredPlatformVersionSuggestions.find((platform: any) => platform.id == this.addDeviceForm.value.platformId).version;
    this.occupiedDevice.ram = this.suggestionOptions[ADD_DEVICE.RAM].find((ram: any) => ram.id == this.addDeviceForm.value.ramId).size;
    this.occupiedDevice.screen = this.suggestionOptions[ADD_DEVICE.SCREEN].find((screen: any) => screen.id == this.addDeviceForm.value.screenId).size;
    this.occupiedDevice.storage = this.suggestionOptions[ADD_DEVICE.STORAGE].find((storage: any) => storage.id == this.addDeviceForm.value.storageId).size;
    this.occupiedDevice.owner = this.addDeviceForm.value.owner;
    this.occupiedDevice.keeper = this.addDeviceForm.value.keeper;
    this.occupiedDevice.serialNumber = this.addDeviceForm.value.serialNumber;
    this.occupiedDevice.comments = this.addDeviceForm.value.comments;
    this.occupiedDevice.inventoryNumber = this.addDeviceForm.value.inventoryNumber;
    this.occupiedDevice.origin = this.suggestionOptions[ADD_DEVICE.ORIGIN].find((origin: any) => origin.id == this.addDeviceForm.value.originId).origin;
    this.occupiedDevice.project = this.suggestionOptions[ADD_DEVICE.PROJECT].find((project: any) => project.id == this.addDeviceForm.value.projectId).name;
  }

  private fetchDropdownValuesIntoSuggestions(): void {
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
}
