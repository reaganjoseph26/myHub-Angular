import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation implements OnInit {
  constructor(private dataService: DataService) {}
  userId: number = 24;
  username: string = 'TobinGriff';
  ngOnInit() {
    console.log('nav is working');
    this.fetchData();
  }

  fetchData(): void {
    this.dataService.getServerData('getActiveUsers').subscribe({
      next: (data) => {
        console.log('Data received successfully:', data);
      },
      error: (error) => {
        console.error('Error fetching data from server:', error);
      },
    });
  }
}
