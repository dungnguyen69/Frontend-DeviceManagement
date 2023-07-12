import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IDevice } from 'src/app/models/IDevice';
import { DeviceService } from 'src/app/services/device.service';
import { LocalService } from 'src/app/services/local.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { constants } from 'src/app/utils/constant';
import { UpdateDeviceComponent } from '../update-device/update-device.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';
import { AddDeviceComponent } from '../add-device/add-device.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import * as saveAs from 'file-saver';
import { ImportDeviceComponent } from '../import-device/import-device.component';

@Component({
  selector: 'app-owning-page',
  templateUrl: './owning-page.component.html',
  styleUrls: ['./owning-page.component.scss']
})
export class OwningPageComponent {
  @Output() isUpdatedSuccessful = new EventEmitter<any>();
  @Output() countNumberOfBookingDevices = new EventEmitter<any>();
  selection = new SelectionModel<IDevice>(true, []);
  pageIndex: number = 0;
  pageSize: number = 10;
  totalPages: number;
  size: number;
  sortBy: string = "id";
  sortDir: string = "desc";
  dataSource = new MatTableDataSource<IDevice>();
  userId: number;
  rowIndex: number = 0;
  BOOKING_DATE: number = 10;
  RETURN_DATE: number = 11;
  roles: string[] = [];
  isLoggedIn = false;
  isAdmin = false;
  isMod = false;
  isUser = false;
  addSuccessful: string;
  addUnsuccessful: string;
  filteredValues: { [key: string]: string } = {
    name: '', status: '', platformName: '', platformVersion: '',
    itemType: '', ram: '', screen: '', storage: '', owner: '',
    keeper: '', keeperNo: '', inventoryNumber: '', serialNumber: '', origin: '', project: '', bookingDate: '', returnDate: ''
  };

  readonly columnsIndex = constants;
  readonly pageSizeOptions: number[] = [10, 20, 50, 100];
  readonly columns: string[] = ['Number', 'Detail', 'SerialNumber', 'DeviceName', 'Status', 'ItemType', 'PlatformName', 'PlatformVersion',
    'RamSize', 'DisplaySize', 'StorageSize', 'InventoryNumber', 'Project', 'Origin', 'Keeper', 'Comments', "KeeperNumber", "Booking date", "Due date", 'Action'];
  readonly columnFilters: string[] = ['NumberFilter', 'Update', 'SerialNumberFilter', 'DeviceNameFilter', 'StatusFilter', 'ItemTypeFilter', 'PlatformNameFilter', 'PlatformVersionFilter',
    'RamSizeFilter', 'DisplaySizeFilter', 'StorageSizeFilter', 'InventoryNumberFilter', 'ProjectFilter', 'OriginFilter', 'KeeperFilter', 'CommentsFilter', "KeeperNumberFilter", "booking date", "due date", 'select'];

  /* Store filter options in an array*/
  readonly dropdownOptions: { [key: string]: any } = {
    status: [],
    itemType: [],
    project: [],
    origin: [],
    keeperNumberOptions: []
  }

  readonly dateFormControlnOptions: { [key: string]: any } = {
    10: new FormControl(new Date('dd/MM/yyyy')),
    11: new FormControl(new Date('dd/MM/yyyy')),
  }

  readonly keywordSuggestionOptions: { [key: string]: any } = {
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

  readonly statusOptions: { [key: string]: any } = {
    'BROKEN': 'badge text-bg-danger p-2',
    'OCCUPIED': 'badge text-bg-warning p-2',
    'VACANT': 'badge text-bg-success  p-2',
    'UNAVAILABLE': 'badge text-bg-dark  p-2'
  }

  readonly keeperNumberDisplay: { [key: string]: any } = {
    0: 'badge text-bg-success p-2',
    1: 'badge text-bg-success p-2',
    2: 'badge text-bg-success  p-2',
    3: 'badge text-bg-danger  p-2'
  }

  constructor(private dialog: MatDialog,
    private deviceService: DeviceService,
    private _snackBar: MatSnackBar,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.checkLogin();
    this.getAllDevicesWithPagination();
    this.checkDateInput();
  }

  openDialogAddDevice() {
    const dialogRef = this.dialog.open(AddDeviceComponent, {
      autoFocus: false
    })
      .afterClosed().subscribe(
        {
          next: (data: any) => {
            if (data?.event == "Submit") {
              this.getAllDevicesWithPagination();
              this.addSuccessful = "ADDED SUCCESSFULLY";
              this.notification(this.addSuccessful, 'Close', "success-snackbar");
            }
          },
          error: () => {
            this.addUnsuccessful = "[ERROR] ADDED UNSUCCESSFULLY";
            this.notification(this.addUnsuccessful, 'Close', "error-snackbar");
          }
        }
      );
    return dialogRef;
  }

  exportDevice() {
    this.deviceService.exportDeviceForOwner(this.userId).subscribe((data: any) => {
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

  importDevice() {
    this.dialog.open(ImportDeviceComponent, {
    })
      .afterClosed().subscribe(
        {
          next: (result: any) => {
            if (result?.event == "accept") {
              this.getAllDevicesWithPagination();
            }
          },
          error: () => {
            let errorMessage = "[ERROR] Import error please try again";
            this.notification(errorMessage, 'Close', "error-snackbar")
          }
        }
      );
  }

  openConfirmationForDeletion() {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: "Do you really want to delete ?",
      }
    })
      .afterClosed().subscribe(
        {
          next: (result) => {
            if (result.event == "accept") {
              this.deleteDevice(this.selection.selected);
              this.selection.clear();
            }
          }
        }
      );
  }

  applyFilterForDropdowns(date?: string) {
    this.pageIndex = 0; /* Reset index */
    this.getAllDevicesWithPagination();
  }

  changeFilterInput(event: any, key_name: (keyof typeof this.filteredValues), column: number) {
    if (this.isFilterFormEmpty(key_name)) {
      if (event === "") {
        this.changeFilterValueToEmpty(key_name);
        this.keywordSuggestionOptions[column] = [];
        return;
      }
      this.suggest(column, event);
      return;
    }
  }

  applyFilterForInputForm(e: MatAutocompleteSelectedEvent, column: string) {
    this.pageIndex = 0; /* Reset index */
    this.filteredValues = {
      ...this.filteredValues,
      [column]: e.option.value
    }
    this.getAllDevicesWithPagination();
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.sortBy = sort.active;
    this.sortDir = sort.direction;
    this.getAllDevicesWithPagination()
  }

  applyFilterForDatePicker(column: string, option: string) {
    this.pageIndex = 0; /* Reset index */
    this.filteredValues = {
      ...this.filteredValues,
      [column]: String(option)
    }
    this.getAllDevicesWithPagination();
  }

  openDialogUpdate(rowId: number, tableIndex: number) {
    let readOnly = !this.allowUpdate();
    this.dialog.open(UpdateDeviceComponent, {
      data: {
        dataKey: rowId,
        submit: true,
        index: tableIndex,
        readOnly: readOnly
      }
    }).afterClosed().subscribe((result) => {
      if (result.event == "Submit") {
        this.refreshDataSourceWithoutFilter();
      }
    });
  }

  suggest(column: number, keyword: string) {
    const filterValue: string = keyword.toLowerCase();
    if (filterValue.trim().length !== 0)
      this.deviceService
        .suggest(column, filterValue, this.filteredValues)
        .subscribe((data: any) => {
          this.keywordSuggestionOptions[column] = data['keywordList'];
        });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: IDevice, index?: number): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${index}`;
  }

  clearDate(dateColumn: number) {
    if (dateColumn == this.BOOKING_DATE) {
      this.filteredValues.bookingDate = ""
    }
    if (dateColumn == this.RETURN_DATE) {
      this.filteredValues.returnDate = ""
    }
    this.dateFormControlnOptions[dateColumn].reset()
    this.getAllDevicesWithPagination();
  }

  handlePagination(e: PageEvent) {
    this.size = this.size - this.pageSize;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getAllDevicesWithPagination();
    this.selection.clear();
  }

  resetFilterValues() {
    Object.entries(this.keywordSuggestionOptions).forEach(([key]) => {
      this.keywordSuggestionOptions[key] = [];
    });
    Object.entries(this.filteredValues).forEach(([key]: any) => {
      this.filteredValues[key] = "";
    });
    this.getAllDevicesWithPagination();
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

  private getAllDevicesWithPagination() {
    this.deviceService
      .getAllOwningDevicesWithPagination(this.userId, this.pageSize!, this.pageIndex + 1, this.sortBy, this.sortDir, this.filteredValues)
      .subscribe((data: any) => {
        this.dataSource.data = data['devicesList'];
        this.dropdownOptions.status = data['statusList'];
        this.dropdownOptions.itemType = data['itemTypeList'];
        this.dropdownOptions.project = data['projectList'];
        this.dropdownOptions.origin = data['originList'];
        this.dropdownOptions.keeperNumberOptions = data['keeperNumberOptions'];
        this.totalPages = data['totalPages'];
        this.size = data['totalElements'];
      });
  }

  private isFilterFormEmpty(key_name: (keyof typeof this.filteredValues)): boolean {
    return this.filteredValues.hasOwnProperty(key_name);
  }

  private changeFilterValueToEmpty(key_name: (keyof typeof this.filteredValues)) {
    Object.entries(this.filteredValues).find(([key]) => {
      if (key === key_name)
        this.filteredValues[key] = "";
    });
    this.getAllDevicesWithPagination();
  }

  private refreshDataSourceWithoutFilter() {
    const areFilterValuesChanged: boolean
      = Object.values(this.filteredValues).every(x => x != "");
    if (!(areFilterValuesChanged)) {
      this.getAllDevicesWithPagination();
    }
  }

  private checkDateInput() {
    this.dateFormControlnOptions[this.BOOKING_DATE].valueChanges.subscribe((value: string) => {
      if (value != "" && value != null)
        this.applyFilterForDatePicker("bookingDate", value);
    })

    this.dateFormControlnOptions[this.RETURN_DATE].valueChanges.subscribe((value: string) => {
      if (value != "" && value != null)
        this.applyFilterForDatePicker("returnDate", value);
    })
  }

  private checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.isMod = this.roles.includes('ROLE_MODERATOR');
      this.isUser = this.roles.includes('ROLE_USER');
      this.userId = user.id;
    }
  }

  private allowUpdate() {
    if (this.isAdmin)
      return true;
    else if (this.isMod)
      return true;
    return false;
  }

  private notification(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 4000,
      panelClass: [className]
    });
  }

  private deleteDevice(selectList: any) {
    if (selectList.length != 0) {
      for (var device of selectList) {
        this.deviceService.deleteDevice(device.Id!).subscribe({
          next: () => {
            this.getAllDevicesWithPagination();
            this.notification("DELETED SUCCESSFULLY", 'Close', "success-snackbar");
          },
          error: (error) => {
            let errorMessage = error.error.errorMessage;
            this.notification(errorMessage, 'Close', "error-snackbar");
          }
        });
      }
    }
  }

}
