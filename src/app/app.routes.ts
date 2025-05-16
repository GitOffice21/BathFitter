import { Routes } from '@angular/router';
import { RecaptchaComponent } from './recaptcha/recaptcha.component';
import { ChatbotsComponent } from './chatbots/chatbots.component';

export const routes: Routes = [
    {
        path: '', 
        component: RecaptchaComponent
      },
      {
        path: 'ChatBot',
        component: ChatbotsComponent
      },
      {
        path: '**',
        component: RecaptchaComponent
      }
];
