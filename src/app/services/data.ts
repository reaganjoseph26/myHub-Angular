import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { menuItem } from '../../../server/models/menuItem.js'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:4200/api/'; 

  constructor(private http: HttpClient) {}

  // Method to fetch data from the server
  getServerData(endPoint:string): Observable<any> {
    return this.http.get<any>(this.apiUrl + endPoint);
  }
}
