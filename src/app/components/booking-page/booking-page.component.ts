import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IDevice } from 'src/app/models/IDevice';
import { DeviceService } from 'src/app/services/device.service';
import { constants } from 'src/app/utils/constant';
import { UpdateDeviceComponent } from '../update-device/update-device.component';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { LocalService } from 'src/app/services/local.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IRequest } from 'src/app/models/IRequest';
import { TokenStorageService } from 'src/app/services/token-storage.service';
export const DD_MM_YYYY_Format = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-booking-page',
    templateUrl: './booking-page.component.html',
    styleUrls: ['./booking-page.component.scss'],

    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format },
    ],
})
export class BookingPageComponent implements OnInit {

    @Output() isUpdatedSuccessful = new EventEmitter<any>();
    @Output() countNumberOfBookingDevices = new EventEmitter<any>();

    selection = new SelectionModel<IDevice>(true, []);
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    size: number;
    requester: any;
    userInfo: any;
    sortBy: string = "id";
    sortDir: string = "desc";
    username: string;
    dataSource = new MatTableDataSource<IDevice>();
    rowIndex: number = 0;
    BOOKING_DATE: number = 10;
    RETURN_DATE: number = 11;
    roles: string[] = [];
    isLoggedIn = false;
    isAdmin = false;
    isMod = false;
    isUser = false;
    filteredValues: { [key: string]: string } = {
        name: '', status: '', platformName: '', platformVersion: '',
        itemType: '', ram: '', screen: '', storage: '', owner: '',
        keeper: '', inventoryNumber: '', serialNumber: '', origin: '', project: '', bookingDate: '', returnDate: ''
    };
    readonly columnsIndex = constants;
    readonly pageSizeOptions: number[] = [10, 20, 50, 100];
    readonly columns: string[] = ['Number', 'Detail', 'SerialNumber', 'DeviceName', 'Status', 'ItemType', 'PlatformName', 'PlatformVersion',
        'RamSize', 'DisplaySize', 'StorageSize', 'InventoryNumber', 'Project', 'Origin', 'Owner', 'Keeper', 'Comments', "Booking", "Booking date", "Due date", 'Action'];
    readonly columnFilters: string[] = ['NumberFilter', 'Update', 'SerialNumberFilter', 'DeviceNameFilter', 'StatusFilter', 'ItemTypeFilter', 'PlatformNameFilter', 'PlatformVersionFilter',
        'RamSizeFilter', 'DisplaySizeFilter', 'StorageSizeFilter', 'InventoryNumberFilter', 'ProjectFilter', 'OriginFilter', 'OwnerFilter', 'KeeperFilter', 'CommentsFilter', 'book', "booking date", "due date", 'select'];

    /* Store filter options in an array*/
    readonly dropdownOptions: { [key: string]: any } = {
        status: [],
        itemType: [],
        project: [],
        origin: []
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

    constructor(private dialog: MatDialog,
        private deviceService: DeviceService,
        private localStore: LocalService,
        private _snackBar: MatSnackBar,
        private tokenStorageService: TokenStorageService) { }

    ngOnInit() {
        this.getAllDevicesWithPagination();

        this.dateFormControlnOptions[this.BOOKING_DATE].valueChanges.subscribe((value: string) => {
            if (value != "" && value != null)
                this.applyFilterForDatePicker("bookingDate", value);
        })

        this.dateFormControlnOptions[this.RETURN_DATE].valueChanges.subscribe((value: string) => {
            if (value != "" && value != null)
                this.applyFilterForDatePicker("returnDate", value);
        })

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

    applyFilterForDatePicker(column: string, option: string) {
        this.pageIndex = 0; /* Reset index */
        this.filteredValues = {
            ...this.filteredValues,
            [column]: String(option)
        }
        this.getAllDevicesWithPagination();
    }

    /* Receive user inputs for pagination */
    handlePagination(e: PageEvent) {
        this.size = this.size - this.pageSize;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.getAllDevicesWithPagination();
        this.selection.clear();
    }

    getAllDevicesWithPagination() {
        this.deviceService
            .getAllDevicesWithPagination(this.pageSize!, this.pageIndex + 1, this.sortBy, this.sortDir, this.filteredValues)
            .subscribe((data: any) => {
                console.log(data);

                this.dataSource.data = data['devicesList'];
                this.dropdownOptions.status = data['statusList'];
                this.dropdownOptions.itemType = data['itemTypeList'];
                this.dropdownOptions.project = data['projectList'];
                this.dropdownOptions.origin = data['originList'];
                this.totalPages = data['totalPages'];
                this.size = data['totalElements'];
            });
    }

    isFilterFormEmpty(key_name: (keyof typeof this.filteredValues)): boolean {
        return this.filteredValues.hasOwnProperty(key_name);
    }

    changeFilterValueToEmptyAndReset(key_name: (keyof typeof this.filteredValues)) {
        Object.entries(this.filteredValues).find(([key]) => {
            if (key === key_name)
                this.filteredValues[key] = "";
        });
        this.getAllDevicesWithPagination();
    }

    changeFilterInput(event: any, key_name: (keyof typeof this.filteredValues), column: number) {
        if (this.isFilterFormEmpty(key_name)) {
            if (event === "") {
                this.changeFilterValueToEmptyAndReset(key_name);
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

    applyFilterForDropdowns(date?: string) {
        this.pageIndex = 0; /* Reset index */
        this.getAllDevicesWithPagination();
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

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: IDevice, index?: number): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${index}`;
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

    openDialogUpdate(rowId: number, tableIndex: number) {
        this.dialog.open(UpdateDeviceComponent, {
            data: {
                dataKey: rowId,
                submit: true,
                index: tableIndex
            }, disableClose: true
        }).afterClosed().subscribe((result) => {
            if (result.event == "Submit") {
                this.refreshDataSourceWithoutFilter();
                // this.isUpdatedSuccessful.emit(rowId);
            }
        });
    }

    /* Were user to not only update the device but also provide filters, the page would be refreshed without losing filters  */
    refreshDataSourceWithoutFilter() {
        const areFilterValuesChanged: boolean
            = Object.values(this.filteredValues).every(x => x != "");
        if (!(areFilterValuesChanged)) {
            this.getAllDevicesWithPagination();
        }
    }

    sortData(sort: Sort) {
        if (!sort.active || sort.direction === '') {
            return;
        }
        this.sortBy = sort.active;
        this.sortDir = sort.direction;
        this.getAllDevicesWithPagination()
    }

    bookingDevices(device: IDevice) {
        if (!this.isClickable(device.Id)) {
            const isDevicesExist = this.getDataStorage().find(e => e.deviceId.toString() === device.Id.toString());
            if (device.Status === 'VACANT' && isDevicesExist === undefined) {
                const request: IRequest = {
                    currentKeeper: device.Keeper,
                    nextKeeper: '',
                    bookingDate: device.BookingDate,
                    returnDate: device.ReturnDate,
                    deviceId: device.Id,
                    itemType: device.ItemType,
                    deviceName: device.DeviceName,
                    platformName: device.PlatformName,
                    platformVersion: device.PlatformVersion,
                    ramSize: device.RamSize,
                    screenSize: device.ScreenSize,
                    storageSize: device.StorageSize,
                    inventoryNumber: device.InventoryNumber,
                    serialNumber: device.SerialNumber,
                    Id: this.getDataStorage().length,
                    ticketId: '',
                    requester: this.username,
                };
                this.localStore.saveData(String(this.getDataStorage().length), JSON.stringify(request));
                this.notification('Added to booking devices successfully', "success-snackbar");
                this.countNumberOfBookingDevices.emit();
            }
            if (isDevicesExist !== undefined) {
                this.notification('This device is already in the booking dialog', "error-snackbar");
            }
            if (device.Status !== 'VACANT') {
                this.notification('Device is unavailable', "error-snackbar");
            }
        }
    }

    getDataStorage() {
        var archive = [],
            keys = Object.keys(localStorage),
            i = keys.length;
        while (i--) {
            archive.push(JSON.parse(this.localStore.getData(keys[i])));
        }
        return archive;
    }

    isClickable(deviceId: any) {
        return this.localStore.getData(deviceId);
    }

    handleBooking(deviceId: string) {
        return this.localStore.getData(deviceId) ? "disable-booking" : "booking-icon";
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
