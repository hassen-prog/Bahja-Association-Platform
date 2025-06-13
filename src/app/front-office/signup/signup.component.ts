// import { Component } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';  // Import Router
// import { UserAuthService } from 'src/app/_services/user-auth.service';

// @Component({
//   selector: 'app-signup',
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.scss']
// })
// export class SignupComponent {

//   errorMessage: string | null = null;
//   successMessage: string | null = null;
//   showBackButton: boolean = false; // Variable to control the visibility of the back button
//   signupForm!: FormGroup;

//   constructor(private fb: FormBuilder, private authService: UserAuthService, private router: Router) {  // Add Router to the constructor
//     this.createForm();
//   }

//   setRole(role: string): void {
//     this.signupForm.patchValue({
//         role: role
//     });
//   }

//   createForm() {
//     this.signupForm = this.fb.group({
//       username: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       userFirstName: [''],
//       userLastName: [''],
//       phoneNumber: [''],
//       location: [''],
//       birthDate: [''],
//       role: ['', Validators.required]
//     });
//   }

//   onSubmit() {
//     if (this.signupForm.valid) {
//       this.authService.register(this.signupForm.value).subscribe({
//         next: (data) => {
//           console.log('Success!', data);
//           this.successMessage = 'You have successfully signed up!';
//           this.errorMessage = null;
//           this.signupForm.reset(); // Reset the form after successful signup
//           this.showBackButton = true; // Show the back button after successful signup
//         },
//         error: (error) => {
//           console.error('Error:', error);
//           this.errorMessage = 'Failed to register. Please try again.';
//           this.successMessage = null;
//           this.showBackButton = false; // Hide back button on error
//         }
//       });
//     } else {
//       this.errorMessage = 'Please fill in all required fields correctly.';
//       this.successMessage = null;
//       this.showBackButton = false; // Hide back button if form is invalid
//     }
//   }

//   goBack() {
//     this.router.navigate(['/front/login']); // Navigate back to the login page
//   }
// }
// signup.component.ts (unchanged functionality)
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/_services/user-auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  errorMessage: string | null = null;
  successMessage: string | null = null;
  showBackButton: boolean = false;
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: UserAuthService, private router: Router) {
    this.createForm();
  }

  setRole(role: string): void {
    this.signupForm.patchValue({
        role: role
    });
  }

  createForm() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userFirstName: [''],
      userLastName: [''],
      phoneNumber: [''],
      location: [''],
      birthDate: [''],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: (data) => {
          console.log('Success!', data);
          this.successMessage = 'You have successfully signed up!';
          this.errorMessage = null;
          this.signupForm.reset();
          this.showBackButton = true;
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Failed to register. Please try again.';
          this.successMessage = null;
          this.showBackButton = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.successMessage = null;
      this.showBackButton = false;
    }
  }

  goBack() {
    this.router.navigate(['/front/login']);
  }
}