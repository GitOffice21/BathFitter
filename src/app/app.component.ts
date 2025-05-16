import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecaptchaComponent } from './recaptcha/recaptcha.component';
import { ChatbotsComponent } from "./chatbots/chatbots.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Recaptcha';
}
