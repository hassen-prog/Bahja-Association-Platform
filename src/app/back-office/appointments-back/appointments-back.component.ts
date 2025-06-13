



import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { Appointment } from 'src/app/_model/appointment';

@Component({
  selector: 'app-appointments-back',
  templateUrl: './appointments-back.component.html',
  styleUrls: ['./appointments-back.component.scss']
})
export class AppointmentsBackComponent implements OnInit {
  appointments: Appointment[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching appointments';
        console.error('Error fetching appointments:', error);
      }
    });
  }

  acceptAppointment(id: number): void {
    this.appointmentService.acceptAppointment(id).subscribe({
      next: (appointment) => {
        this.successMessage = 'Appointment accepted successfully';
        this.appointments = this.appointments.map(a => a.id === appointment.id ? appointment : a);
      },
      error: (error) => {
        this.errorMessage = 'Error accepting appointment';
        console.error('Error accepting appointment:', error);
      }
    });
  }

  rejectAppointment(id: number): void {
    this.appointmentService.rejectAppointment(id).subscribe({
      next: (appointment) => {
        this.successMessage = 'Appointment rejected successfully';
        this.appointments = this.appointments.map(a => a.id === appointment.id ? appointment : a);
      },
      error: (error) => {
        this.errorMessage = 'Error rejecting appointment';
        console.error('Error rejecting appointment:', error);
      }
    });
  }
}

