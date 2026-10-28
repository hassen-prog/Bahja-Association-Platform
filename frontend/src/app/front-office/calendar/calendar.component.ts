import { Component, ChangeDetectorRef, signal } from '@angular/core';
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AppointmentService } from '../../_services/appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { JoinInterestDialogComponent } from '../join-interest-dialog/join-interest-dialog.component';
import listPlugin from '@fullcalendar/list';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          overflow: 'hidden',
          opacity: 0,
          padding: '0 20px',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          padding: '10px 20px',
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class CalendarComponent {
  calendarEvents: any[] = [];
  expandedIndex: number | null = null;
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, listPlugin],
    themeSystem: 'Materia',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth',
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
  });

  currentEvents = signal<EventApi[]>([]);

  constructor(
    private appointmentService: AppointmentService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.loadAppointments();
  }
  loadAppointments() {
    this.appointmentService.getAllAppointments().subscribe((data) => {
      // Store events with full details
      this.calendarEvents = data.map((a) => ({
        id: String(a.id),
        title: a.description,
        date: a.dateTime,
        members: a.members ?? [],
        interested: a.interested ?? [],
      }));

      // Map only necessary fields for FullCalendar rendering
      const calendarEventInputs = this.calendarEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
      }));

      this.calendarOptions.update((opts) => ({
        ...opts,
        events: calendarEventInputs,
      }));
    });
  }
  // loadAppointments() {
  //   this.appointmentService.getAllAppointments().subscribe((data) => {
  //     const events = data.map((a) => ({
  //       id: String(a.id), // Convert to string
  //       title: a.description,
  //       date: a.dateTime,
  //     }));

  //     this.calendarOptions.update((opts) => ({
  //       ...opts,
  //       events,
  //     }));
  //   });
  // }
  toggleEventDetails(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
  handleEventClick(clickInfo: EventClickArg): void {
    const dialogRef = this.dialog.open(JoinInterestDialogComponent);

    dialogRef
      .afterClosed()
      .subscribe((choice: 'join' | 'interested' | undefined) => {
        const userId = localStorage.getItem('username');
        const appointmentId = clickInfo.event.id;

        if ((choice === 'join' || choice === 'interested') && userId) {
          this.appointmentService
            .markAs(appointmentId, userId, choice)
            .subscribe({
              next: () => alert(`Marked as ${choice}`),
              error: (err) => alert('Error: ' + err.message),
            });
        }
      });
  }
}
