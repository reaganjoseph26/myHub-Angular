import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4200/api/';

  getHomeData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getHomeData')
  }
}
