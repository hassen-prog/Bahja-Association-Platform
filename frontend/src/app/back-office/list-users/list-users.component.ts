import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Role } from 'src/app/_model/role.model';
import { User } from 'src/app/_model/user.model';
import { RoleService } from 'src/app/_services/role.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  roles!: Role[];
  users!: User[];
  dataSource = new MatTableDataSource<User>([]);
  
  displayedColumns: string[] = ['userName', 'userFirstName', 'userLastName', 'userEmail', 'phoneNumber', 'location', 'birthDate', 'role'];

  constructor(
    
    private userService: UserService,
    private roleService: RoleService
  ) {}


  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsersWithRoles().subscribe(
      (users: User[]) => {
        console.log('Loaded users:', users);  // Check the console to see the data
        this.dataSource.data = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  getRolesDisplay(user: User): string {
    return user.role ? user.role.map(role => role.roleName).join(', ') : '';
  }


  loadRoles() {
    this.roleService.getAllRoles().subscribe(
      (roles: Role[]) => {
        this.roles = roles;
      },
      (error) => {
        console.error('Error loading roles:', error);
      }
    );
  }

}



