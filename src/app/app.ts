import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from "../app/@components/navigation/navigation";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MyHub';
}
