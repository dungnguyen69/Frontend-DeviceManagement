import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + 'api/users/login', { username, password }, httpOptions);
  }

  register(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/users/register', data, httpOptions);
  }

  verifyToken(token: any): Observable<any> {
    return this.http.post(this.baseUrl + `api/users/verify?token=${token}`, {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    });
  }

  verifyPasswordToken(token: any): Observable<any> {
    return this.http.post(this.baseUrl + `api/users/verify_reset_password_token?token=${token}`, {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    });
  }

  resendToken(token: any): Observable<any> {
    return this.http.post(this.baseUrl + `api/users/resendRegistrationToken?existingToken=${token}`, {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(this.baseUrl + `api/users/reset_password?email=${email}`, httpOptions);
  }

  saveForgotPassword(password: any): Observable<any> {
    return this.http.put(this.baseUrl + `api/users/save_forgot_password`, password, httpOptions);
  }

  saveResetPassword(password: any): Observable<any> {
    return this.http.put(this.baseUrl + `api/users/save_reset_password`, password, httpOptions);
  }
}
