import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// import { menuItem } from '../../../server/models/menuItem.js'
import { BehaviorSubject } from 'rxjs';
import { User } from './interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4200/api/';
  private userDataSubject = new BehaviorSubject<User | null>(null);
  public userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Method to fetch data from the server
  getProfileData(endpoint: string): Observable<any> {
    return this.http.get<User>(this.apiUrl + endpoint).pipe(
      tap((data) => {
        console.log('getProfileData: ', data);
        //this.userDataSubject.next(data);
      }),
    );
  }

  getUserData(username: string): Observable<any> {
    console.log(username, ' username')
    return this.http.get<any>(this.apiUrl + `getUserData/${username}`).pipe(
      tap((data) => {
        this.userDataSubject.next(data);
        console.log('Data passing through service:', data);
      }),
    );
  }

  // getTestData(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl + 'profile').pipe(
  //     tap((data) => {
  //       this.userDataSubject.next(data);
  //       console.log('Data passing through service:', data);
  //     }),
  //   );
  // }
}
