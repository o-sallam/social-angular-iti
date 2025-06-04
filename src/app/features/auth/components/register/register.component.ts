import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../users/models/user.model';

// Custom Validator for password matching
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    // set error on matchingControl if validation fails
    if (matchingControl.errors && !matchingControl.errors['matching']) {
      // return if another validator has already found an error on the matchingControl
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ matching: true });
      return { matching: true }; // Return error for the form group if needed for global display
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Changed styleUrl to styleUrls
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  registrationError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.registrationError = null;

    if (this.registerForm.invalid) {
      return;
    }

    // Exclude confirmPassword from the user data sent to the backend
    const { confirmPassword, ...userData } = this.registerForm.value;
    // Optionally, add a default image or let the backend handle it
    const userToRegister: Partial<User> = {
        ...userData,
        image: 'assets/user-default.webp'
        // id will be assigned by json-server
    };

    this.authService.register(userToRegister as User).subscribe({
      next: (user: User) => {
        console.log('Registration successful', user);
        // Optionally, log the user in directly or redirect to login page with a success message
        this.router.navigate(['/auth/login'], { queryParams: { registered: true } });
      },
      error: (error: any) => { // Can be more specific, e.g. HttpErrorResponse
        this.registrationError = error.message || 'Registration failed. Please try again.';
        console.error('Registration failed', error);
      }
    });
  }
}
