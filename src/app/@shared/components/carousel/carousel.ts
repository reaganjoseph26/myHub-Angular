import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

export interface CarouselSlide {
  id?: number;
  sys_id?: number;
  img?: string;
  firstname?: string;
  lastname?: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, YouTubePlayer],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel {
  @ViewChild('carouselWrapper', { read: ElementRef }) track!: ElementRef;
  public slides = input.required<CarouselSlide[]>();

  scrollNext() {
    const el = this.track.nativeElement;
    // Scrolls right by the exact visible width of the carousel container
    el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
  }

  scrollPrev() {
    const el = this.track.nativeElement;
    // Negative clientWidth scrolls back to the previous hidden set
    el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
  }

  constructor() {
    effect(() => {
      // Call the signal like a function to read its current value
      console.log('Slides updated:', this.slides());
    });
  }
}
