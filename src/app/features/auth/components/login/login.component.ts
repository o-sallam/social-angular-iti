import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjust path as necessary
import { User } from '../../../users/models/user.model'; // Import User model

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Changed styleUrl to styleUrls
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Definite assignment assertion
  submitted = false;
  loginError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = null;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.f['email'].value;
    const password = this.f['password'].value;

    this.authService.login(email, password).subscribe({
      next: (user) => { // Type will be inferred as User
        // Handle successful login
        // For example, store user info and navigate to a protected route or home
        console.log('Login successful', user);
        this.router.navigate(['/']); // Navigate to home or dashboard
      },
      error: (error: any) => { // Can be more specific if error structure is known, e.g., HttpErrorResponse
        this.loginError = error; // Display error message
        console.error('Login failed', error);
      }
    });
  }
}
