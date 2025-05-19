
import { Component, Renderer2 } from '@angular/core';
// import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  selector: 'app-recaptcha',
  standalone: true,
  imports: [ CommonModule,NgxMaskDirective,MatInputModule,
    MatFormFieldModule,MatSelectModule,
    MatOptionModule, FormsModule,ReactiveFormsModule],
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.css'],
  providers: [provideNgxMask()],
})
export class RecaptchaComponent {
  modalVisible: boolean = false;
  captchaResponse: string | null = null;
  verify: boolean = false;
  currentScript: string = '';
  currentMask = '000-000-0000';
  vapiForm!: FormGroup;



  constructor(private renderer: Renderer2, private fb: FormBuilder, private http: HttpClient) {
    this.vapiForm = this.fb.group({
      name: [''],
      phoneCode: ['+91'],
      phoneNumber: [''],
  
    });
  }

  openCaptcha(scriptType: 'first' | 'second' | 'third') {
    console.log("clicked");
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
        this.loadThirdScript();
      }

    } else {
      setTimeout(() => {
        alert('reCAPTCHA verification failed!');
        this.closeModal();
      }, 1000);
    }
  }

loadThirdScript() {
  const script = this.renderer.createElement('script');
  script.type = 'text/javascript';
  script.text = `

  var vapiInstance = null;
    const assistant = "416ec917-efd7-4e33-926c-0186af4823c5"; // Substitute with your assistant ID
    const apiKey = "120e912b-1cce-40ef-9cbc-aec372ea1121"; // Substitute with your Public key from Vapi Dashboard.
    const buttonConfig = {}; // Modify this as required
 
    (function (d, t) {
      var g = document.createElement(t),
        s = d.getElementsByTagName(t)[0];
      g.src =
        "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
      g.defer = true;
      g.async = true;
      s.parentNode.insertBefore(g, s);
 
      g.onload = function () {
        vapiInstance = window.vapiSDK.run({
          apiKey: apiKey, // mandatory
          assistant: assistant, // mandatory
          config: buttonConfig, // optional
        });
      };
    })(document, "script");
  `
    ;
  this.renderer.appendChild(document.body, script);
}
countryCodes = [
  { label: '+91 (IN)', value: '+91', mask: '000-000-0000' }, // India (XXX-XXX-XXXX)
  { label: '+1 (US)', value: '+1', mask: '000-000-0000' }, // USA (XXX-XXX-XXXX)
  { label: '+44 (UK)', value: '+44', mask: '00000-000000' }, // UK (XXXXX-XXXXXX)
  { label: '+61 (AU)', value: '+61', mask: '0000-000-000' }, // Australia
  { label: '+81 (JP)', value: '+81', mask: '00-0000-0000' }, // Japan
  { label: '+49 (DE)', value: '+49', mask: '0000-0000000' }, // Germany
  { label: '+33 (FR)', value: '+33', mask: '000-000-000' }, // France
  { label: '+39 (IT)', value: '+39', mask: '000-000-0000' }, // Italy
  { label: '+7 (RU)', value: '+7', mask: '000-000-0000' }, // Russia
  { label: '+86 (CN)', value: '+86', mask: '000-0000-0000' }, // China
  { label: '+82 (KR)', value: '+82', mask: '000-0000-0000' }, // South Korea
  { label: '+971 (AE)', value: '+971', mask: '000-000-0000' }, // UAE
  { label: '+55 (BR)', value: '+55', mask: '00-00000-0000' }, // Brazil
  { label: '+34 (ES)', value: '+34', mask: '000-000-000' }, // Spain
  { label: '+31 (NL)', value: '+31', mask: '000-000-0000' }, // Netherlands
  { label: '+46 (SE)', value: '+46', mask: '000-000-0000' }, // Sweden
  { label: '+41 (CH)', value: '+41', mask: '00-000-0000' }, // Switzerland
  { label: '+52 (MX)', value: '+52', mask: '000-000-0000' }, // Mexico
  { label: '+27 (ZA)', value: '+27', mask: '000-000-0000' }, // South Africa
  { label: '+66 (TH)', value: '+66', mask: '00-0000-0000' }, // Thailand
  { label: '+92 (PK)', value: '+92', mask: '0000-0000000' }, // Pakistan
  { label: '+20 (EG)', value: '+20', mask: '000-000-0000' }, // Egypt
  { label: '+62 (ID)', value: '+62', mask: '000-000-0000' }, // Indonesia
  { label: '+63 (PH)', value: '+63', mask: '000-0000-0000' }, // Philippines
  { label: '+98 (IR)', value: '+98', mask: '000-000-0000' }, // Iran
  { label: '+90 (TR)', value: '+90', mask: '000-000-0000' }, // Turkey
  { label: '+65 (SG)', value: '+65', mask: '0000-0000' }, // Singapore
  { label: '+60 (MY)', value: '+60', mask: '000-000-000' }, // Malaysia
  { label: '+93 (AF)', value: '+93', mask: '00-000-0000' }, // Afghanistan
];
filteredCountryCodes = [...this.countryCodes];

filterCountry(event: Event) {
  const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.filteredCountryCodes = this.countryCodes.filter((code) =>
    code.label.toLowerCase().includes(searchValue)
  );
}


updateMask(selectedCode: string) {
  const selectedCountry = this.countryCodes.find(
    (country) => country.value === selectedCode
  );
  this.currentMask = selectedCountry ? selectedCountry.mask : '000-000-0000'; // Default

 // this.vapiForm.get('phoneCode')?.setValue(code);
}


submitForm() {
  if (this.vapiForm.invalid) {
    console.error("Form is invalid");
    return;
  }

  const name = this.vapiForm.get('name')?.value;
  const phone = `${this.vapiForm.get('phoneCode')?.value}${this.vapiForm.get('phoneNumber')?.value}`;

  let requestBody = new FormData();
  requestBody.append('phone_number', phone);
  requestBody.append('user_name', name);


  this.http.post(
    'https://bf.netsmartz.us/backend/initiate_vapi_call',
    requestBody
   
  ).subscribe({
    next: response => {
      console.log('API Success:', response);
      this.showSuccessMessage();
    },
    error: err => {
      console.error('API Error:', err);
    }
  });
}



showSuccessMessage() {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: 'Call initiated.',
  });
}


}














































































