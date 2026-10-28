import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../_model/appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8086/api/appointments';

  constructor(private http: HttpClient) {}

  createAppointment(appointment: Appointment): Observable<Appointment> {
    const user = JSON.parse(localStorage.getItem('user')!);
    appointment.userId = user.id;
    return this.http.post<Appointment>(`${this.apiUrl}/create`, appointment);
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/all`);
  }

  markAs(appointmentId: string, userId: string, action: 'join' | 'interested') {
    return this.http.post(
      `${this.apiUrl}/${appointmentId}/${action}?userId=${userId}`,
      {}
    );
  }

  getAppointmentsByStatus(status: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/status/${status}`);
  }

  // acceptAppointment(id: number): Observable<Appointment> {
  //   return this.http.put<Appointment>(`${this.apiUrl}/${id}/accept`, {});
  // }
  acceptAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/accept`, {});
  }

  rejectAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/reject`, {});
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/mine`);
  }
}
