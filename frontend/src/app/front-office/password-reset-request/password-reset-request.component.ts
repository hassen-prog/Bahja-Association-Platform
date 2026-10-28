import { Component } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss']
})
export class PasswordResetRequestComponent {
  email!: string;
  message!: string;

  constructor(private userService: UserService) {}

  requestPasswordReset() {
    this.userService.requestPasswordReset(this.email).subscribe(
      response => {
        console.log(response);
        this.email = '';
        this.message = "A reset link has been sent to your email.";
      },
      error => {
        console.error('There was an error:', error);
        this.message = "ERROR Something went wrong";
      }
    );
  }
}
