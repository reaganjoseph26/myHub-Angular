import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, input, signal, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

export interface CarouselSlide {
  title: string;
  img?: string;
  url: string; // If present, displays <youtube-player>
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
  public currentIndex = signal(0);

  public nextSlide(): void {
    this.currentIndex.update((i) => (i + 1) % this.slides().length);
  }

  public prevSlide(): void {
    this.currentIndex.update(
      (i) => (i - 1 + this.slides().length) % this.slides().length,
    );
  }

    

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
