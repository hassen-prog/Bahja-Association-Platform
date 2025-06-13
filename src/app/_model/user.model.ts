import { Role } from "./role.model";


export class User {

    userFirstName!: string;
    userLastName!: string;
    userName!: string;
    userPassword!: string;
    userEmail!: string;
    role!: Role[];
    location!: string;
    phoneNumber!: string;
    birthDate!: Date 

  }
