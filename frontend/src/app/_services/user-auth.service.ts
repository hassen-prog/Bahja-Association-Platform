import { Injectable } from '@angular/core';
import { User } from '../_model/user.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {


  private registerUrl = 'http://localhost:8086/register';
  constructor(private http: HttpClient) {}

  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): any[] {
    const rolesString = localStorage.getItem('roles');
    return rolesString ? JSON.parse(rolesString) : [];
  }


  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }
  public setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }
    getUser():User {
   return  JSON.parse(localStorage.getItem('user') || '');

  }

  public getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }
public setUsername(username: string) {
  localStorage.setItem('username', username);
}

  public isAdmin() {
    const roles: any[] = this.getRoles();
    return roles[0].roleName =='Admin';
  }
  public isUser() {
    const roles: any[] = this.getRoles();
    return roles[0].roleName =='User';
  }

public getUsername(): string {
  const username = localStorage.getItem('username');
  return username || "";
}


    // Fetch user profile
  getUserProfile(): Observable<User> {
    return this.http.get<User>('http://localhost:8086/profile');
  }

  // Update user profile
  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>('http://localhost:8086/profileEdit', user);
  }



  register(userData: any): Observable<any> {
    return this.http.post(this.registerUrl, userData);
  }
}
