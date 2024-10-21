import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credentials } from '../../../core/interfaces/credentials';
import { Auth } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, PasswordModule, InputTextModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  isRecoveryPassword = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // método para iniciar sesion
  login() {
    if (this.loginForm.valid) {
      const creds: Credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      console.log('form value', creds);
      this.auth.login(creds).subscribe((response) => {
        this.router.navigate(['/dashboard']);
      });
    } else {
      console.log('formulario inválido');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  recoveryPassword() {
    this.isRecoveryPassword = !this.isRecoveryPassword;
  }
}
