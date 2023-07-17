import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UpdateDeviceComponent } from './components/update-device/update-device.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { FileSaverModule } from 'ngx-filesaver';
import { DatePipe } from '@angular/common';
import { ImportDeviceComponent } from './components/import-device/import-device.component';
import { DragDropDirective } from './components/import-device/drag-drop.directive';
import { MatBadgeModule } from '@angular/material/badge';
import { SubmittingPageComponent } from './components/submitting-page/submitting-page.component';
import { LoginComponent } from './components/login/login.component';
import { authInterceptorProviders } from './utils/auth.interceptor';
import { RequestPageComponent } from './components/request-page/request-page.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { SendForgotPasswordComponent } from './components/send-forgot-password/send-forgot-password.component';
import { MatChipsModule } from '@angular/material/chips';
import { ProvidePermissionComponent } from './components/provide-permission/provide-permission.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { OwningPageComponent } from './components/owning-page/owning-page.component';
import { KeepingPageComponent } from './components/keeping-page/keeping-page.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ReceiveForgotPasswordComponent } from './components/receive-forgot-password/receive-forgot-password.component';
import { CookieService } from 'ngx-cookie-service';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { KeeperOrderListComponent } from './components/keeper-order-list/keeper-order-list.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { ReceiveEmailVerificationComponent } from './components/receive-email-verification/receive-email-verification.component';
@NgModule({
  declarations: [
    AppComponent,
    BookingPageComponent,
    HomePageComponent,
    AddDeviceComponent,
    UpdateDeviceComponent,
    ConfirmationDialogComponent,
    ImportDeviceComponent,
    DragDropDirective,
    SubmittingPageComponent,
    LoginComponent,
    RequestPageComponent,
    UserPageComponent,
    SendForgotPasswordComponent,
    ProvidePermissionComponent,
    ProfilePageComponent,
    OwningPageComponent,
    KeepingPageComponent,
    ResetPasswordComponent,
    ReceiveForgotPasswordComponent,
    ErrorPageComponent,
    KeeperOrderListComponent,
    RegisterPageComponent,
    ReceiveEmailVerificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    HttpClientModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule,
    NgbModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTooltipModule,
    FileSaverModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  providers: [DatePipe, authInterceptorProviders, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
