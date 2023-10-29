import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  submitRequests(requestsList: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/requests/submissions', requestsList, config);
  }

  suggest(employeeId: number, column: number, keyword: string, filteredValues?: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('column', column);
    params = params.append('keyword', keyword);
    Object.entries(filteredValues)
      .filter(([_, value]) => value != "")
      .forEach(([key, _]) => params = params.append(key, filteredValues[key]));
    return this.http.get(this.baseUrl + `api/requests/suggestions/${employeeId}`, { params: params });
  }

  getRequestsWithPaging(employeeId: number, pageSize: number, pageNo: number, sortBy: string, sortDir: string, filteredValues?: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('pageSize', pageSize);
    params = params.append('pageNo', pageNo);
    params = params.append('sortBy', sortBy);
    params = params.append('sortDir', sortDir);
    Object.entries(filteredValues)
      .filter(([_, value]) => value != "")
      .forEach(([key, _]) => params = params.append(key, filteredValues[key]));
    return this.http.get(this.baseUrl + `api/requests/${employeeId}`, { params: params });
  }

  updateRequestStatus(input: any): Observable<any> {
    return this.http.put(this.baseUrl + 'api/requests/status-update', input);
  }

  extendDurationForReturnDate(deviceId: number, nextKeeper: string, returnDate: any): Observable<any> {
    let inputs = { deviceId: deviceId, nextKeeper: nextKeeper, returnDate: returnDate }
    return this.http.post(this.baseUrl + `api/requests/keepers/extend-duration`, inputs);
  }
}
