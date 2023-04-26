import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string;
  password: string;
  isInvalidUsername: boolean;
  isInvalidPassword: boolean;

  constructor(
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  handleLogin() {
    this.isInvalidUsername = false;
    this.isInvalidPassword = false;
    if (this.username != environment.username || this.password != environment.password) {
      if (this.username != environment.username && this.password != environment.password) {
        this.isInvalidUsername = true;
        this.isInvalidPassword = true;
      }
      else if (this.username != environment.username) this.isInvalidUsername = true;
      else this.isInvalidPassword = true;
    } else this.router.navigate(['/dashboard']);
  }

  onUsernameBlur(event: any) {
    this.username = event;
  }

  onPasswordBlur(event: any) {
    this.password = event;
  }
}
