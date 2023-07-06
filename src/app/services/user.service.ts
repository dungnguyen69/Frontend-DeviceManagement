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
    return this.http.get<String[]>(this.baseUrl + 'api/users/suggestion', { params: params });
  }
}
