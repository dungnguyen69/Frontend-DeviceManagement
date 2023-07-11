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

  forgotPassword(email: string): Observable<any> {
    return this.http.post(this.baseUrl + `api/users/reset_password?email=${email}`, httpOptions);
  }

  saveForgotPassword(password: any): Observable<any> {
    console.log(password);
    
    return this.http.put(this.baseUrl + `api/users/save_forgot_password`, password, httpOptions);
  }

  register(
    userName: string,
    email: string,
    password: string,
    matchingPassword: string,
    badgeId: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    project: string): Observable<any> {
    return this.http.post(this.baseUrl + 'api/users/register', {
      userName,
      email,
      password,
      matchingPassword,
      badgeId,
      firstName,
      lastName,
      phoneNumber,
      project
    }, httpOptions);
  }

}
