import { Component } from '@angular/core';
import { Appointment } from 'src/app/_model/appointment';
import { AppointmentService } from 'src/app/_services/appointment.service';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss'],
})
export class CreateAppointmentComponent {
  appointment: Appointment = new Appointment();
  successMessage: string | null = null;

  constructor(private appointmentService: AppointmentService) {}

  createAppointment(): void {
    this.appointmentService.createAppointment(this.appointment).subscribe({
      next: (data) => {
        console.log('Appointment created:', data);
        this.successMessage = 'Appointment has been created successfully!';
        this.appointment = new Appointment(); // Clear the form

        // Clear the success message after 5 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      },
      error: (e) => console.error(e),
    });
  }
}
