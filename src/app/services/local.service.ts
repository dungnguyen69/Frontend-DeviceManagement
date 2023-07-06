import { Injectable } from '@angular/core';
import { IRequest } from '../models/IRequest';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }


  // public saveData(key: string, value: string) {
  //   localStorage.setItem(key, this.encrypt(value));
  // }

  // public getData(key: string) {
  //   let data = localStorage.getItem(key)|| "";
  //   return this.decrypt(data);
  // }

  public saveData(key: string, value: string) {
    localStorage.setItem(key,  value);
  }

  public getData(key: string) {
    let data = localStorage.getItem(key) || "";
    return data;
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  public countKeys(): number{
    return Object.keys(localStorage).length;
  }
}
