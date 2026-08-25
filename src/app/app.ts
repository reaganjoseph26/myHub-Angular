import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navigation } from '../app/@components/navigation/navigation';
import * as THREE from 'three';
// import NET from 'vanta/dist/vanta.net.min';
// import VANTA from 'vanta/dist/vanta.net.min';
import { ThemeService } from './services/ThemeService';
import { filter, map, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('vantaBg', { static: false }) vantaBg!: ElementRef;
  protected title = 'DevHub';
  private vantaEffect: any;
  private router = inject(Router);
  readonly themeService = inject(ThemeService);
  public authService = inject(AuthService);

  defaultThemeSub!: Subscription;
  defaultTheme!: any | null;

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects || event.url),
    ),
    { initialValue: this.router.url },
  );

  private async loadVantaEffect(effectName: string) {
    try {
      await import(
        `../../node_modules/vanta/dist/vanta.${effectName.toLowerCase()}.min.js`
      );
      const globalVanta = (window as any).VANTA;
      const effectKey = effectName.toUpperCase();

      // Initialize Vanta effect
      this.vantaEffect = globalVanta[effectKey]({
        el: '#vanta-background',
        THREE: THREE,
        ...this.defaultTheme.options,
      });
    } catch (error) {
      console.error(`Failed to load Vanta effect: ${effectName}`, error);
    }
  }

  async ngAfterViewInit() {
    await this.loadVantaEffect(this.defaultTheme.style);
  }

  // constructor() {
  //   effect(() => {
  //     const isUserLoggedIn = this.authService.isLoggedIn();
  //     console.log('####', isUserLoggedIn);
      
  //   });
  // }

  ngOnInit() {
    this.defaultThemeSub = this.themeService.defaultTheme$.subscribe({
      next: (data) => {
        this.defaultTheme = data;
        const color =
          '#' +
          Number(data.options.color)
            .toString(16)
            .padStart(6, '0')
            .toUpperCase();
        const backgroundColor =
          '#' +
          Number(data.options.backgroundColor)
            .toString(16)
            .padStart(6, '0')
            .toUpperCase();
        const activeColor =
          '#' +
          Number(data.options.activeColor)
            .toString(16)
            .padStart(6, '0')
            .toUpperCase();

        this.changeColor(color, backgroundColor, activeColor);

        //this.ngZone.runOutsideAngular(() => {
        // this.vantaEffect = NET({
        //   el: '#vanta-background',
        //   THREE: THREE,
        //   ...this.defaultTheme.options,
        // });
        // });
      },
      error: (err) => {
        console.log(
          'An error has occurred subscribing to user data in home component. Error: ',
          err,
        );
      },
    });
  }

  changeColor(color: string, bg: string, active: string) {
    this.themeService.setColors(color, bg, active); // Updates across the app
  }

  showNavigation = () => this.currentUrl() !== '/login';

  // initVanta() {
  //   if (typeof VANTA !== 'undefined' && this.vantaBg) {
  //     this.vantaEffect = VANTA.BIRDS({
  //       el: this.vantaBg.nativeElement,
  //       mouseControls: true,
  //       touchControls: true,
  //       gyroControls: false,
  //       minHeight: 200.0,
  //       minWidth: 200.0,
  //       scale: 1.0,
  //       scaleMobile: 1.0,
  //     });
  //   }
  // }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
}
