import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import { USER } from 'src/assets/constant';
import { ProvidePermissionComponent } from '../provide-permission/provide-permission.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<any>();
  onDestroy$: Subject<boolean> = new Subject();
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
  sortBy: string = "id";
  sortDir: string = "desc";
  filteredValues: { [key: string]: string } = {
    badgeId: '', userName: '', firstName: '', lastName: '', email: '',
    phoneNumber: '', project: ''
  };

  readonly columnsIndex = USER;
  readonly pageSizeOptions: number[] = [10, 20, 50, 100];
  readonly dropdownOptions: { [key: string]: any } = { projectList: [] }
  readonly keywordSuggestionOptions: { [key: string]: any } = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  }
  readonly columns: string[] = ['Number', 'BadgeID', 'User Name', 'First Name', 'Last Name', 'Email', 'Phone Number', 'Project', 'isEnable', 'Action'];
  readonly columnFilters: string[] = ['NumberFilter', 'BadgeIDFilter', 'UserNameFilter', 'FirstNameFilter', 'LastNameFilter', 'EmailFilter', 'PhoneNumberFilter', 'ProjectFilter', 'Enable', 'action'];
  constructor(
    private userService: UserService,
    private tokenStorageService: TokenStorageService,
    private dialog: MatDialog) { }
  ngOnInit(): void {
    this.checkLogin();
    this.getUsersWithPaging();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  applyFilterForDropdowns(date?: string) {
    this.pageIndex = 0; /* Reset index */
    this.getUsersWithPaging();
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

  handlePagination(e: PageEvent) {
    this.size = this.size - this.pageSize;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getUsersWithPaging();
  }

  resetFilterValues() {
    Object.entries(this.keywordSuggestionOptions).forEach(([key]) => {
      this.keywordSuggestionOptions[key] = [];
    });
    Object.entries(this.filteredValues).forEach(([key]: any) => {
      this.filteredValues[key] = "";
    });
    this.getUsersWithPaging();
  }

  applyFilterForInputForm(e: MatAutocompleteSelectedEvent, column: string) {
    this.pageIndex = 0; /* Reset index */
    this.filteredValues = {
      ...this.filteredValues,
      [column]: e.option.value
    }
    this.getUsersWithPaging();
  }

  openProvidePermissionDialog(row: any, tableIndex: number) {
    const dialogRef = this.dialog.open(ProvidePermissionComponent, {
      data: {
        dataKey: row,
        submit: true,
        index: tableIndex,
      },
      autoFocus: false
    })
      .afterClosed().subscribe(
        {
          next: (data: any) => {
            this.getUsersWithPaging();
          },
        }
      );
    return dialogRef;
  }

  private getUsersWithPaging() {
    this.userService
      .getUsersWithPaging(this.pageSize!, this.pageIndex + 1, this.sortBy, this.sortDir, this.filteredValues)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.dataSource.data = data['usersList'];
        this.dropdownOptions.requestStatusList = data['projectList'];
        this.totalPages = data['totalPages'];
        this.size = data['totalElements'];
      });
  }

  private changeFilterValueToEmpty(key_name: (keyof typeof this.filteredValues)) {
    Object.entries(this.filteredValues).find(([key]) => {
      if (key === key_name)
        this.filteredValues[key] = "";
    });
    this.getUsersWithPaging();
  }

  private isFilterFormEmpty(key_name: (keyof typeof this.filteredValues)): boolean {
    return this.filteredValues.hasOwnProperty(key_name);
  }

  private suggest(column: number, keyword: string) {
    const filterValue: string = keyword.toLowerCase();
    if (filterValue.trim().length !== 0)
      this.userService
        .suggest(column, filterValue, this.filteredValues)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data: any) => {
          this.keywordSuggestionOptions[column] = data['keywordList'];
        });
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
}
