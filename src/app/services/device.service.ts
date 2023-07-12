import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
const headers = new HttpHeaders().set('Content-Disposition', 'application/octet-stream',);

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getAllDevicesWithPagination(pageSize: number, pageNo: number, sortBy: string, sortDir: string, filteredValues?: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('pageSize', pageSize);
    params = params.append('pageNo', pageNo);
    params = params.append('sortBy', sortBy);
    params = params.append('sortDir', sortDir);
    Object.entries(filteredValues)
      .filter(([_, value]) => value != "")
      .forEach(([key, _]) => params = params.append(key, filteredValues[key]));
    return this.http.get(this.baseUrl + 'api/devices/warehouse', { params: params });
  }

  suggest(column: number, keyword: string, filteredValues?: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('column', column);
    params = params.append('keyword', keyword);
    Object.entries(filteredValues)
      .filter(([_, value]) => value != "")
      .forEach(([key, _]) => params = params.append(key, filteredValues[key]));
    return this.http.get<String[]>(this.baseUrl + 'api/devices/warehouse/suggestion', { params: params });
  }

  getDropDownValues(): Observable<any> {
    return this.http.get<String[]>(this.baseUrl + 'api/devices/warehouse/drop-down-values');
  }

  addDevice(filteredValues: any): Observable<any> {
    return this.http.post<String[]>(this.baseUrl + 'api/devices/warehouse', filteredValues, config);
  }

  updateDevice(rowId: number, device: any): Observable<any> {
    return this.http.put<String[]>(this.baseUrl + `api/devices/warehouse/${rowId}`, device, config);
  }

  deleteDevice(rowId: number): Observable<any> {
    return this.http.delete(this.baseUrl + `api/devices/warehouse/${rowId}`, config);
  }

  getDetailDevice(rowId: number): Observable<any> {
    return this.http.get(this.baseUrl + `api/devices/warehouse/${rowId}`, config);
  }

  exportDevice(): Observable<any> {
    return this.http.get(this.baseUrl + `api/devices/warehouse/export`, { headers, responseType: 'blob' });
  }

  exportDeviceForOwner(userId: number): Observable<any> {
    return this.http.get(this.baseUrl + `api/devices/warehouse/export/${userId}`, { headers, responseType: 'blob' });
  }

  getTemplateImportDevice(): Observable<any> {
    return this.http.get(this.baseUrl + `api/devices/warehouse/download-template`, { headers, responseType: 'blob' });
  }

  importDevice(userId: number, data: any): Observable<any> {
    return this.http.post(this.baseUrl + `api/devices/warehouse/import/${userId}`, data, { headers });
  }

  getAllOwningDevicesWithPagination(ownerId: number, pageSize: number, pageNo: number, sortBy: string, sortDir: string, filteredValues?: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('pageSize', pageSize);
    params = params.append('pageNo', pageNo);
    params = params.append('sortBy', sortBy);
    params = params.append('sortDir', sortDir);
    Object.entries(filteredValues)
      .filter(([_, value]) => value != "")
      .forEach(([key, _]) => params = params.append(key, filteredValues[key]));
    return this.http.get(this.baseUrl + `api/devices/owners/${ownerId}`, { params: params });
  }

  updateReturnOwnedDevice(deviceId: number, currentKeeperId: number): Observable<any> {
    let inputs = { deviceId: deviceId, currentKeeperId: currentKeeperId}
    return this.http.put(this.baseUrl + `api/devices/owners/return`, inputs, { headers });
  }
}
