import { User } from './user.model';
export class Appointment {
  id!: number;
  dateTime?: Date;
  description?: string;
  status?: string;
  userId?: string;
  message?: string;
  user?: {
    userName: string;
    userFirstName: string;
    userLastName: string;
  };
  members!: User[]; // ✅ new
  interested!: User[];
}
