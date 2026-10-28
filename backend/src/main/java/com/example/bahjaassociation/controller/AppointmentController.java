package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.dto.Appointment.AppointmentDTO;
import com.example.bahjaassociation.entity.Appointment;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.service.AppointmentService;
import com.example.bahjaassociation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private UserService userService;



    @PostMapping("/create")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userService.findByUsername(username);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(appointmentService.createAppointment(appointment, user.getUserName()));
    }



  /*  @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }*/
  @GetMapping("/all")
  public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
      List<AppointmentDTO> dtos = appointmentService.getAllAppointmentDTOs();
      return ResponseEntity.ok(dtos);
  }


    // Optional: Endpoint for an admin to view appointments by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(@PathVariable String status) {
        List<Appointment> appointments = appointmentService.getAppointmentsByStatus(status);
        return ResponseEntity.ok(appointments);
    }


//    @PutMapping("/{appointmentId}/accept")
//    public void acceptAppointment(@PathVariable Long appointmentId) {
//        appointmentService.acceptAppointment(appointmentId);
//    }
@PutMapping("/{appointmentId}/accept")
public Appointment acceptAppointment(@PathVariable Long appointmentId) {
    return appointmentService.acceptAppointment(appointmentId);
}

    @PutMapping("/{id}/reject")
    public ResponseEntity<Appointment> rejectAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentService.findById(id);
        appointment.setStatus("Rejected");
        return ResponseEntity.ok(appointmentService.saveAppointment(appointment));
    }


    @GetMapping("/appointments/mine")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        String userName = ((User) authentication.getPrincipal()).getUserName();
        List<Appointment> appointments = appointmentService.getAppointmentsForUser(userName);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<AppointmentDTO> joinAppointment(@PathVariable Long id, @RequestParam String userId) {
        Appointment appointment = appointmentService.addMember(id, userId);
        return ResponseEntity.ok(appointmentService.toDTO(appointment));
    }

    @PostMapping("/{id}/interested")
    public ResponseEntity<AppointmentDTO> interestedAppointment(@PathVariable Long id, @RequestParam String userId) {
        Appointment appointment = appointmentService.addInterested(id, userId);
        return ResponseEntity.ok(appointmentService.toDTO(appointment));
    }


}
