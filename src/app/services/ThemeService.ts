import { Injectable, Inject, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly backgroundColor = signal('#ffffff');
  readonly color = signal('#000000');
  readonly activeColor = signal('#0aca4a');
  private apiUrl = 'http://localhost:4200/api/';
  private defaultThemeSubject = new BehaviorSubject<any | null>(null);
  public defaultTheme$ = this.defaultThemeSubject.asObservable();

  constructor(private http: HttpClient) {
    effect(() => {
      const root = document.documentElement;
      root.style.setProperty('--app-background-color', this.backgroundColor());
      root.style.setProperty('--app-color', this.backgroundColor());
      root.style.setProperty('--app-activeColor', this.activeColor());
    });
  }

  
  getDefaultTheme(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getDefaultTheme').pipe(
      tap((data) => {
        this.defaultThemeSubject.next(data);
        console.log('Default Theme Data Log in Service:', data);
      }),
    );
  }

  setColors(color: string, bg: string, active: string) {
    this.backgroundColor.set(color);
    this.color.set(bg);
    this.activeColor.set(active);
  }
}
