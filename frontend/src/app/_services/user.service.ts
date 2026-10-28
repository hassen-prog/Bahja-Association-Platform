import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { User } from '../_model/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  PATH_OF_API = 'http://localhost:8086';

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });
  constructor(
    private httpclient: HttpClient,
    private userAuthService: UserAuthService
  ) { }

  public login(loginData: any) {
    return this.httpclient.post(this.PATH_OF_API + '/authenticate', loginData, {
      headers: this.requestHeader,
    });
  }
  public existsbyusername(username:string):Observable<boolean> {
    return this.httpclient.post<boolean>(this.PATH_OF_API + '/existByusername',username)
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


  createUserWithRole(user: User, roleName: string): Observable<User> {
    const url = `${this.PATH_OF_API}/createUserWithRole`;
    const params = { roleName: roleName.toString() };
    return this.httpclient.post<User>(url, user, { params });
  }



  getAllUsers(): Observable<User[]> {
    return this.httpclient.get<User[]>(`${this.PATH_OF_API}/allUsers`);
  }



  getAllUsersWithRoles(): Observable<User[]> {
    return this.httpclient.get<User[]>('http://localhost:8086/users-with-roles');
  }



  deleteUser(userName: string) {
    return this.httpclient.delete(`${this.PATH_OF_API}/delete/${userName}`);
  }



  





resetPassword(resToken: string, newPassword: string) {
  const body = { resToken, newPassword };
  return this.httpclient.post(this.PATH_OF_API + '/resetPassword', body);
}


requestPasswordReset(email: string): Observable<any> {
  return this.httpclient.post(`${this.PATH_OF_API}/requestPasswordReset`, { email: email });
}

}
