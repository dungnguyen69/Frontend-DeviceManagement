import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { IRequest } from 'src/app/models/IRequest';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { RequestService } from 'src/app/services/request.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { REQUEST } from 'src/app/utils/constant';
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
  selector: 'app-request-page',
  templateUrl: './request-page.component.html',
  styleUrls: ['./request-page.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format },
  ],
})
export class RequestPageComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  user: any;
  username: any;
  isLoggedIn: boolean;
  roles: any;
  isAdmin: any;
  isMod: any;
  isUser: any;
  pageIndex: number = 0;
  pageSize: number = 10;
  totalPages: number;
  size: number;
  requester: any;
  userInfo: any;
  sortBy: string = "id";
  sortDir: string = "desc";
  BOOKING_DATE: number = 5;
  RETURN_DATE: number = 6;
  columnsIndex = REQUEST;
  filteredValues: { [key: string]: string } = {
    requestId: '', device: '', currentKeeper: '', nextKeeper: '',
    requester: '', requestStatus: '', bookingDate: '', returnDate: ''
  };
  readonly pageSizeOptions: number[] = [10, 20, 50, 100];
  readonly columns: string[] = ['Number', 'Request', 'DeviceName', 'RequestStatus', 'Requester', 'CurrentKeeper', 'NextKeeper', "Booking date", "Due date", 'Action'];
  readonly columnFilters: string[] = ['NumberFilter', 'RequestFilter', 'DeviceNameFilter', 'RequestStatusFilter', 'RequesterFilter', 'CurrentKeeperFilter', 'NextKeeperFilter', "BookingDateFilter", "DueDateFilter", 'select'];
  readonly dropdownOptions: { [key: string]: any } = { requestStatusList: [] }
  readonly keywordSuggestionOptions: { [key: string]: any } = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  }
  readonly statusOptions: { [key: string]: any } = {
    'REJECTED': 'badge text-bg-danger p-2',
    'CANCELLED': 'badge text-bg-danger p-2',
    'APPROVED': 'badge text-bg-success  p-2',
    'TRANSFERRED': 'badge text-bg-dark  p-2',
    'PENDING': 'badge text-bg-warning p-2',
    'RETURNED': 'badge text-bg-dark  p-2',
    'EXTENDING': 'badge text-bg-dark  p-2',
  }
  readonly dateFormControlnOptions: { [key: string]: any } = {
    5: new FormControl(new Date('dd/MM/yyyy')),
    6: new FormControl(new Date('dd/MM/yyyy')),
  }
  constructor(private _snackBar: MatSnackBar, private localStore: LocalService, private requestService: RequestService,
    private tokenStorageService: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.checkLogin();
    this.getRequestsWithPaging();
    this.dateFormControlnOptions[this.BOOKING_DATE].valueChanges.subscribe((value: string) => {
      if (value != "" && value != null)
        this.applyFilterForDatePicker("bookingDate", value);
    })

    this.dateFormControlnOptions[this.RETURN_DATE].valueChanges.subscribe((value: string) => {
      if (value != "" && value != null)
        this.applyFilterForDatePicker("returnDate", value);
    })
  }

  getRequestsWithPaging() {
    this.requestService.getRequestsWithPaging(this.user.id, this.pageSize!, this.pageIndex + 1, this.sortBy, this.sortDir, this.filteredValues)
      .subscribe((data: any) => {
        console.log(data);

        this.dataSource.data = data['requestsList'];
        this.dropdownOptions.requestStatusList = data['requestStatusList'];
        this.totalPages = data['totalPages'];
        this.size = data['totalElements'];
      });
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
    this.getRequestsWithPaging();
  }

  applyFilterForDropdowns(date?: string) {
    this.pageIndex = 0; /* Reset index */
    this.getRequestsWithPaging();
  }

  clearDate(dateColumn: number) {
    if (dateColumn == this.BOOKING_DATE) {
      this.filteredValues.bookingDate = ""
    }
    if (dateColumn == this.RETURN_DATE) {
      this.filteredValues.returnDate = ""
    }
    this.dateFormControlnOptions[dateColumn].reset()
    this.getRequestsWithPaging();
  }

  handlePagination(e: PageEvent) {
    this.size = this.size - this.pageSize;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getRequestsWithPaging();
  }

  resetFilterValues() {
    Object.entries(this.keywordSuggestionOptions).forEach(([key]) => {
      this.keywordSuggestionOptions[key] = [];
    });
    Object.entries(this.filteredValues).forEach(([key]: any) => {
      this.filteredValues[key] = "";
    });
    this.getRequestsWithPaging();
  }

  private suggest(column: number, keyword: string) {
    const filterValue: string = keyword.toLowerCase();
    if (filterValue.trim().length !== 0)
      this.requestService
        .suggest(this.user.id, column, filterValue, this.filteredValues)
        .subscribe((data: any) => {
          this.keywordSuggestionOptions[column] = data['keywordList'];
        });
  }

  private changeFilterValueToEmptyAndReset(key_name: (keyof typeof this.filteredValues)) {
    Object.entries(this.filteredValues).find(([key]) => {
      if (key === key_name)
        this.filteredValues[key] = "";
    });
    this.getRequestsWithPaging();
  }

  private isFilterFormEmpty(key_name: (keyof typeof this.filteredValues)): boolean {
    return this.filteredValues.hasOwnProperty(key_name);
  }

  private checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
      this.roles = this.user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.isMod = this.roles.includes('ROLE_MODERATOR');
      this.isUser = this.roles.includes('ROLE_USER');
      this.username = this.user.username;
    }
  }

  private applyFilterForDatePicker(column: string, option: string) {
    this.pageIndex = 0; /* Reset index */
    this.filteredValues = {
      ...this.filteredValues,
      [column]: String(option)
    }
    this.getRequestsWithPaging();
  }
}
