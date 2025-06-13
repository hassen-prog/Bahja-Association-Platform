import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  resToken!: string;
  newPassword!: string;
  message!: string;
  passwordResetSuccess: boolean = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {
    this.resToken = this.route.snapshot.paramMap.get('resToken')!;
  }

  resetPassword() {
    this.userService.resetPassword(this.resToken, this.newPassword).subscribe(response => {
      this.message = "Password has been reset successfully.";
      this.newPassword='';
      this.passwordResetSuccess = true;
    }, error => {
      this.message = "ERROR: Couldn't reset the password";
    });
  }
  navigateToLogin() {
    this.router.navigateByUrl('/front/login'); // Assuming '/login' is the route to your login page
}
}