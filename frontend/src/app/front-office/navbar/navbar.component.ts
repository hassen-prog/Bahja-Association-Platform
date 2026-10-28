import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/_model/user.model';
import { UserAuthService } from 'src/app/_services/user-auth.service';
import { UserService } from 'src/app/_services/user.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user = new User();
  constructor(
    public userService: UserService,
    public userAuthService: UserAuthService,
    public router: Router,
    private authService: UserAuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    console.log(this.user);
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    this.userAuthService.clear();
    this.router.navigate(['/front/login']);
  }

  public roleMatch(allowedRoles: string | any[]): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();

    if (userRoles != null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i].roleName === allowedRoles[j]) {
            isMatch = true;
          }
        }
      }
    }
    return isMatch;
  }
}
