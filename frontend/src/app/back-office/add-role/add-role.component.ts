import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/_model/role.model';
import { RoleService } from 'src/app/_services/role.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent {
  roleForm: FormGroup;
  role!: Role[];
 




  constructor(private userService: UserService,
   private roleService: RoleService,
   private formBuilder: FormBuilder,
   
   )  {
    this.roleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
      roleDescription: ['', Validators.required],

    });

    this.loadRoles();


  }






  ngOnInit(): void {
  }



  onSubmit(f: any) {
    if (this.roleForm.invalid) {
      return;
    }

    const role: Role = {
      roleName: this.roleForm.value.roleName,
      roleDescription: this.roleForm.value.roleName,

    };


    this.roleService.addRole(role)
      .subscribe(
        (response) => {
          console.log('Role created successfully!', response);

        //  this.successMessage="user added successfully!";
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });

         this.roleForm.reset();

         this.loadRoles();
         f.submitted = false;




        },
        (error) => {
          console.error('Error creating user:', error);
        }
      );
  }


  loadRoles() {
    this.roleService.getAllRoles().subscribe(
      (role: Role[]) => {
        this.role = role;
      },
      (error) => {
        console.error('Error loading roles:', error);
      }
    );
  }



}
