import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/_model/appointment';
import { AppointmentService } from 'src/app/_services/appointment.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  myAppointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.loadMyAppointments();
  }

  loadMyAppointments(): void {
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.myAppointments = data;
      },
      error: (e) => console.error(e)
    });
  }
}