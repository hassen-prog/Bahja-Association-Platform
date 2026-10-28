import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/_services/user-auth.service';
import { UserService } from 'src/app/_services/user.service';







@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})



export class LoginComponent {




  valCheck: string[] = ['remember'];
  error = false;
  password!: string;
  validform = false;

  constructor(private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router,
    ) { }



  ngOnInit(): void {


   }
//   show() {
//     this.messageService.add({
//       severity: 'success', summary: 'Success', detail:
//         'Message Content'
//     });
// }
  login(loginForm: NgForm) {
    this.validform = false;
    this.error = false;
    if (loginForm.value.userName !='' && loginForm.value.userPassword !='' ) {
      this.userService.login(loginForm.value).subscribe(
        (response: any) => {
          this.userAuthService.setRoles(response.user.role);
          this.userAuthService.setToken(response.jwtToken);
          this.userAuthService.setUser(response.user);
          this.userAuthService.setUsername(response.user.userName);
          
          console.log('Login successful as user:', response.user.userName);
          
          const role = response.user.role[0].roleName;
          if (role === 'Admin') {
            this.router.navigate(['/admin/list-users']);
          } else if (role === 'Parent') {
            this.router.navigate(['/front/dashboardF/parent']);
          }
          else if (role === 'Kid') {
            this.router.navigate(['/front/dashboardF/kid']);
          } else if (role === 'pm') {
            // this.router.navigate(['/pm']);
            this.router.navigate(['/dashboard/PmPages']);
          } else {
            this.router.navigate(['/user']);
          }
        },
        (error) => {
          console.log(error);
          this.error = true;
        }
      );
    } else {

      this.validform = true;
    }


  console.log(this.error)
  }
}
