
import { Component, Renderer2 } from '@angular/core';
// import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
interface Trace {
  type: string;
  payload: {
    name: string;
  };
}
interface Window {
  voiceflow: {
    chat: {
      interact: (payload: any) => void;
    };
  }
}
interface RenderProps {
  trace: Trace;
  element: HTMLElement;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}


@Component({
  selector: 'app-chatbots',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './chatbots.component.html',
  styleUrl: './chatbots.component.css'
})
export class ChatbotsComponent {
  modalVisible: boolean = false;
  captchaResponse: string | null = null;
  verify: boolean = false;
  currentScript: string = '';

  constructor(private renderer: Renderer2) {}

  openCaptcha(scriptType: 'first' | 'second' | 'third') {
    this.currentScript = scriptType;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  onCaptchaResolved(response: string | null) {
    if (response) {
      this.captchaResponse = response;
      this.verifyCaptcha(response);
    }
  }

  verifyCaptcha(response: string) {
    if (response) {
      this.verify = true;
      this.closeModal();
      if(this.currentScript === 'third'){
        this.DynamicSmartzBot();
      }
    
    } else {
      setTimeout(() => {
        alert('reCAPTCHA verification failed!');
        this.closeModal();
      }, 1000);
    }
  }

 
  DynamicSmartzBot() {
  const script = this.renderer.createElement('script');
  script.type = 'text/javascript';
  script.text = `
    (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        console.log('Voiceflow widget script loaded.');

        // Define the FormExtension
        const FormExtension = {
          name: 'Forms',
          type: 'response',
          match: ({ trace }) => {
            console.log('Checking trace object in match:', trace);
            return trace.type === 'Custom_Form' || trace.payload?.name === 'Custom_Form';
          },
          render: ({ trace, element }) => {
            console.log('Rendering form for trace:', trace);

            const formContainer = document.createElement('form');
            formContainer.innerHTML = \`
<style>
            form {
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              background: #f9f9f9;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              font-family: Arial, sans-serif;
              box-sizing: border-box;
            }
            .form-group {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
            }
            .form-group input {
              flex: 1;
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 10px;
              font-size: 1em;
              outline: none;
              transition: border-color 0.3s;
              box-sizing: border-box;
            }
            .form-group input:focus {
              border-color: #2e7ff1;
            }
            input[type="email"] {
              width: 100%;
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 10px;
              font-size: 1em;
              outline: none;
              transition: border-color 0.3s;
              box-sizing: border-box;
              margin-bottom: 15px;
            }
            input[type="email"]:focus {
              border-color: #2e7ff1;
            }
            input[type="submit"] {
              background: linear-gradient(to right, #2e6ee1, #2e7ff1);
              border: none;
              color: white;
              padding: 12px;
              border-radius: 5px;
              font-size: 1em;
              cursor: pointer;
              width: 100%;
              transition: background 0.3s;
            }
            input[type="submit"]:hover {
              background: linear-gradient(to right, #265ed1, #266fe1);
            }
            .invalid {
              border-color: red;
            }
</style>
<div class="form-group">
<input type="text" class="name" name="name" required placeholder="Enter your name *">
</div>
<div class="form-group">
<input type="tel" class="phone" name="phone" 
              pattern="[789][0-9]{9}" 
              title="Invalid phone number, please enter only numbers" 
              placeholder="Enter your phone [optional]">
</div>
<input type="email" class="email" name="email" required 
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" 
            title="Invalid email address" 
            placeholder="Enter your email *"><br>
<input type="submit" class="submit" value="Submit">
        \`;
        formContainer.addEventListener('input', function () {
            const name = formContainer.querySelector('.name');
            const email = formContainer.querySelector('.email');
            const phone = formContainer.querySelector('.phone');
            if (name.checkValidity()) name.classList.remove('invalid');
            if (email.checkValidity()) email.classList.remove('invalid');
            if (phone.checkValidity()) phone.classList.remove('invalid');
        });
        formContainer.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = formContainer.querySelector('.name');
            const email = formContainer.querySelector('.email');
            const phone = formContainer.querySelector('.phone');
            if (
                !name.checkValidity() ||
                !email.checkValidity() ||
                !phone.checkValidity()
            ) {
                if (!name.checkValidity()) name.classList.add('invalid');
                if (!email.checkValidity()) email.classList.add('invalid');
                return;
            }
            formContainer.querySelector('.submit').remove();
            window.voiceflow.chat.interact({
                type: 'complete',
                payload: { name: name.value, email: email.value, phone: phone.value },
            });
        });
        element.appendChild(formContainer);
          },
        };

        // Load the chatbot and add the FormExtension
        window.voiceflow.chat.load({
          verify: { projectID: '67791ded11ca569c18c161d0' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          assistant: {
            extensions: [FormExtension],
          },
        });

        console.log('Voiceflow chatbot loaded with FormExtension.');
      };
      v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; 
      v.type = "text/javascript"; 
      s.parentNode.insertBefore(v, s);
    })(document, 'script');
  `;
  this.renderer.appendChild(document.body, script);
}
}