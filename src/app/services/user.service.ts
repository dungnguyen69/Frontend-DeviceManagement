import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  suggest(column: number, keyword: string, filteredValues?: any): Observable<String[]> {
    let params = new HttpParams();
    params = params.append('column', column);
    params = params.append('keyword', keyword);
    if(filteredValues != undefined){
      Object.entries(filteredValues)
      .filter(([_, value]) => value != "")
      .forEach(([key, _]) => params = params.append(key, filteredValues[key]));
    }
    return this.http.get<String[]>(this.baseUrl + 'api/users/suggestion', { params: params });
  }

  getUsersWithPaging(pageSize: number, pageNo: number, sortBy: string, sortDir: string, filteredValues?: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('pageSize', pageSize);
    params = params.append('pageNo', pageNo);
    params = params.append('sortBy', sortBy);
    params = params.append('sortDir', sortDir);
    Object.entries(filteredValues)
      .filter(([_, value]) => value != "")
      .forEach(([key, _]) => params = params.append(key, filteredValues[key]));
    return this.http.get(this.baseUrl + 'api/users', { params: params });
  }

  providePermission(userId: number, permission: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('permission', permission);
    return this.http.put(this.baseUrl + 'api/users/authorization', params );
  }

  updateProfile(profile: any): Observable<any> {
    return this.http.put(this.baseUrl + 'api/users/update_profile', profile );
  }
}
