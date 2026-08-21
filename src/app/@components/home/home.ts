import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/UsersService';
import { Navigation } from '../navigation/navigation';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../services/interfaces/user';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/DataService';
import {
  Carousel,
  CarouselSlide,
} from '../../@shared/components/carousel/carousel';

@Component({
  selector: 'app-home',
  imports: [Carousel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  userSub!: Subscription;
  userData!: User | null;
  public homeSlides = signal<CarouselSlide[]>([]);
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {
    this.route.data.subscribe(({ userData }) => {
      this.userService.setUserData(userData);
      this.userData = userData;
    });
  }

  ngOnInit(): void {
    console.log(this.userData, ' this.userData');
    this.dataService.getHomeData().subscribe({
      next: (data) => {
        console.log('data coming in on home component: ', data);
        this.homeSlides.update((slides) =>
          data.lessons.map((slide: CarouselSlide) => ({
            ...slide,
            url: this.extractVideoId(slide.url), // Replace property for all items
          })),
        );
        // if (data.lessons.length > 0) {
        //   for (const l of data.lessons) {
        //     const slide: CarouselSlide = {
        //       title: l.title,
        //       url: this.extractVideoId(l.url),
        //     };

        //     this.homeSlides.update((currentSlides) => [
        //       ...currentSlides,
        //       slide,
        //     ]);
        //   }
        // }
      },
      error: (err) => {
        console.log('An error has occurred getting home data. Error: ', err);
      },
    });
  }

  // displayLessons(lessons: Array<[]>) {

  // }

  extractVideoId(url: string): string {
    // Regex matches standard, short, embed, and shorts YouTube links
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);

    // YouTube IDs are always 11 characters long
    return match && match[2].length === 11 ? match[2] : '';
  }

  ngOnDestroy() {
    // Prevent memory leaks by unsubscribing manually
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
