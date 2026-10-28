import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_model/user.model';
import { UserService } from 'src/app/_services/user.service';
import { UserAuthService } from 'src/app/_services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = new User();
  isEditingProfile = false; 
  tempUser: User = new User();
  showMessage = false;
  messageText = '';
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.userAuthService.getUser();
    console.log(this.user);
    this.userAuthService.getUserProfile().subscribe(
      (user) => {
        this.user = user;
        this.tempUser = { ...user };
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  toggleEditMode() {
    this.isEditingProfile = !this.isEditingProfile;
    if (!this.isEditingProfile) {
      this.tempUser = { ...this.user };
    }
  }

  saveUserProfile() {
    this.userAuthService.updateUserProfile(this.tempUser).subscribe(
      (updatedUser) => {
        this.user = updatedUser;
        this.messageText = 'Profile successfully updated!';
        this.showMessage = true;
        this.toggleEditMode();  // Close editing mode
        setTimeout(() => this.showMessage = false, 3000);  // Message disappears after 3 seconds
      },
      (error) => {
        console.error('Error updating user profile:', error);
        this.messageText = 'Error updating profile!';
        this.showMessage = true;
        setTimeout(() => this.showMessage = false, 3000);
      }
    );
  }
}
