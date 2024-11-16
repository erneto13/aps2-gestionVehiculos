import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Credentials } from '../../../core/interfaces/credentials';
import { Auth } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, PasswordModule,
    InputTextModule, ReactiveFormsModule,
    CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private auth: Auth,
    private router: Router,
    private fb: FormBuilder,
    public loadingService: LoadingService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const creds: Credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.auth.login(creds).subscribe(() => {
        this.auth.getDetailUser().subscribe({
          next: () => this.router.navigate(['/panel']),
          error: (err) => console.error('Error fetching driver profile:', err)
        });
      });
    } else {
      console.log('formulario inválido');
    }
  }
}
