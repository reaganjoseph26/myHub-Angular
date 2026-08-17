import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from '../app/@components/navigation/navigation';
import * as THREE from 'three';
// import NET from 'vanta/dist/vanta.net.min';
// import VANTA from 'vanta/dist/vanta.net.min';
import { ThemeService } from './services/ThemeService';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('vantaBg', { static: false }) vantaBg!: ElementRef;
  protected title = 'DevHub';
  private vantaEffect: any;
  private ngZone = inject(NgZone);
  readonly themeService = inject(ThemeService);

  defaultThemeSub!: Subscription;
  defaultTheme!: any | null;

  private async loadVantaEffect(effectName: string) {
    try {
      // Pass a partial static path so the bundler can split chunks correctly
      await import(
        `../../node_modules/vanta/dist/vanta.${effectName.toLowerCase()}.min.js`
      );
      //const effectConstructor = vantaModule.default || vantaModule;
      const globalVanta = (window as any).VANTA;
      const effectKey = effectName.toUpperCase();

      // Initialize Vanta effect
      this.vantaEffect = globalVanta[effectKey]({
        el: '#vanta-background',
        THREE: THREE,
        ...this.defaultTheme.options,
      });

      // this.vantaEffect = effectConstructor({
      //   el: this.vantaRef.nativeElement,
      //   mouseControls: true,
      //   touchControls: true,
      //   gyroControls: false,
      //   minHeight: 200.0,
      //   minWidth: 200.0
      // });
    } catch (error) {
      console.error(`Failed to load Vanta effect: ${effectName}`, error);
    }
  }

  async ngAfterViewInit() {
    console.log('####: ', this.defaultTheme.style);
    await this.loadVantaEffect(this.defaultTheme.style);
  }

  ngOnInit() {
    this.defaultThemeSub = this.themeService.defaultTheme$.subscribe({
      next: (data) => {
        this.defaultTheme = data;
        this.changeColor(data.options.color, data.options.backgroundColor, data.options.activeColor);
        console.log('this is the current default theme: ', this.defaultTheme);

        //const style: string = this.defaultTheme.style
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

  
  changeColor(color:string, bg:string, active:string) {
    this.themeService.setColors(color, bg, active); // Updates across the app
  }

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
