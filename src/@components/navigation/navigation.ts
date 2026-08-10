import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})

export class Navigation implements OnInit {
  userId: number = 24;
  username: string = "TobinGriff";
   ngOnInit() {
    console.log('nav is working')
   }
}
