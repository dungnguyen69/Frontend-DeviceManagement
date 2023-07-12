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
        keeper: '', keeperNo: '', inventoryNumber: '', serialNumber: '', origin: '', project: '', bookingDate: '', returnDate: ''
    };
    readonly columnsIndex = constants;
    readonly pageSizeOptions: number[] = [10, 20, 50, 100];
    readonly columns: string[] = ['Number', 'Detail', 'SerialNumber', 'DeviceName', 'Status', 'ItemType', 'PlatformName', 'PlatformVersion',
        'RamSize', 'DisplaySize', 'StorageSize', 'InventoryNumber', 'Project', 'Origin', 'Owner', 'Keeper', 'Comments', "KeeperNumber", "Booking", "Booking date", "Due date"];
    readonly columnFilters: string[] = ['NumberFilter', 'Update', 'SerialNumberFilter', 'DeviceNameFilter', 'StatusFilter', 'ItemTypeFilter', 'PlatformNameFilter', 'PlatformVersionFilter',
        'RamSizeFilter', 'DisplaySizeFilter', 'StorageSizeFilter', 'InventoryNumberFilter', 'ProjectFilter', 'OriginFilter', 'OwnerFilter', 'KeeperFilter', 'CommentsFilter', "KeeperNumberFilter", 'book', "booking date", "due date"];

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
        private localStore: LocalService,
        private _snackBar: MatSnackBar,
        private tokenStorageService: TokenStorageService) { }

    ngOnInit() {
        this.getAllDevicesWithPagination();
        this.checkDateInput();
        this.checkLogin();
    }

    applyFilterForDatePicker(column: string, option: string) {
        this.pageIndex = 0; /* Reset index */
        this.filteredValues = {
            ...this.filteredValues,
            [column]: String(option)
        }
        this.getAllDevicesWithPagination();
    }

    handlePagination(e: PageEvent) {
        this.size = this.size - this.pageSize;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.getAllDevicesWithPagination();
        this.selection.clear();
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
        // let readOnly = !this.allowUpdate();
        this.dialog.open(UpdateDeviceComponent, {
            data: {
                dataKey: rowId,
                submit: true,
                index: tableIndex,
                readOnly: true
            }
        }).afterClosed().subscribe((result) => {
            if (result?.event == "Submit") {
                this.refreshDataSourceWithoutFilter();
            }
        });
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
            const isDevicesExistInStorage = this.getDataStorage().find(e => e.deviceId.toString() === device.Id.toString());
            if (device.Status === 'VACANT' || (device.Status === 'OCCUPIED' && device.KeeperNumber < 3) && isDevicesExistInStorage === undefined) {
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
                    Id: device.Id,
                    ticketId: '',
                    requester: this.username,
                };
                this.localStore.saveData(String(request.Id), JSON.stringify(request));
                this.notification('Added to booking devices successfully', 'Close', "success-snackbar");
                this.countNumberOfBookingDevices.emit();
            }
            if (isDevicesExistInStorage !== undefined) {
                this.notification('This device is already in the booking dialog', 'Close', "error-snackbar");
            }
        }
    }

    isClickable(deviceId: any) {
        const isDevicesExistInStorage = this.getDataStorage().find(e => e.deviceId.toString() === deviceId.toString());
        return isDevicesExistInStorage;
    }

    handleBooking(deviceId: string) {
        const isDevicesExistInStorage = this.getDataStorage().find(e => e.deviceId.toString() === deviceId.toString());
        return isDevicesExistInStorage ? "disable-booking" : "booking-icon";
    }

    /* If users update the device whereas filters are still intact, the page will be refreshed without losing filters  */
    private refreshDataSourceWithoutFilter() {
        const areFilterValuesChanged: boolean
            = Object.values(this.filteredValues).every(x => x != "");
        if (!(areFilterValuesChanged)) {
            this.getAllDevicesWithPagination();
        }
    }

    private getDataStorage() {
        var archive = [],
            keys = Object.keys(localStorage),
            i = keys.length;
        while (i--) {
            archive.push(JSON.parse(this.localStore.getData(keys[i])));
        }
        return archive;
    }

    getAllDevicesWithPagination() {
        this.deviceService
            .getAllDevicesWithPagination(this.pageSize!, this.pageIndex + 1, this.sortBy, this.sortDir, this.filteredValues)
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

    private notification(message: string, action: string, className: string) {
        this._snackBar.open(message, action, {
            horizontalPosition: "right",
            verticalPosition: "top",
            duration: 4000,
            panelClass: [className]
        });
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
            this.username = user.username;
        }
    }

    // private allowUpdate() {
    //     if (this.isAdmin)
    //         return true;
    //     else if (this.isMod)
    //         return true;
    //     return false;
    // }
}
