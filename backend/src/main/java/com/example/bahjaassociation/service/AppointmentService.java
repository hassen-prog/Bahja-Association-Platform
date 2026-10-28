package com.example.bahjaassociation.service;


import com.example.bahjaassociation.dto.Appointment.AppointmentDTO;
import com.example.bahjaassociation.dto.user.UserDTO;
import com.example.bahjaassociation.entity.Appointment;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.AppointmentRepository;
import com.example.bahjaassociation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender emailSender;



    public Appointment findById(Long id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public Appointment saveAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }
    public List<Appointment> getAppointmentsForUser(String userName) {
        return appointmentRepository.findByUser_UserName(userName);
    }



    public Appointment createAppointment(Appointment appointment, String userName)  {
        User user = userRepository.findByUserName(userName);
        appointment.setUser(user);
        appointment.setStatus("Pending");
        List<User> allUsers = userRepository.findAll(); // assuming you use Spring Data JPA
        sendAppointmentCreatedEmailToAllUsers(allUsers, appointment);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }



//    public void acceptAppointment(Long appointmentId) {
//        Appointment appointment = appointmentRepository.findById(appointmentId)
//                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
//
//        appointment.acceptAppointment();
//        appointmentRepository.save(appointment);
//
//        sendAppointmentAcceptanceEmail(appointment.getUser(), appointment);
//    }
//
//    private void sendAppointmentAcceptanceEmail(User user, Appointment appointment) {
//        try {
//            MimeMessage mimeMessage = emailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
//
//            String htmlContent = "<div style='font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 2px solid #ccc;'>" +
//                    "<table width='100%'><tr><td></td><td style='text-align:right;'>" +
//                    "<img src='cid:logoImage' alt='Your Logo' style='width: 150px;'>" +
//                    "</td></tr></table>" +
//                    "<h1 style='color: #333366;'>Hello " + user.getUserName() + ",</h1>" +
//                    "<hr style='border-top: 1px solid #ccc;'/>" +
//                    "<p style='font-size: 18px;'>Your appointment on <strong>" + appointment.getDateTime() + "</strong> has been accepted.</p>" +
//                    "<p style='font-size: 18px;'>You can now log in to check the appointment details.</p>" +
//                    "<br/>" +
//                    "<p style='font-size: 18px;'>Thank you,</p>" +
//                    "<p style='font-size: 18px;'>Your App Team</p>" +
//                    "<div class='layout-footer' style='margin-top: 20px;'>" +
//                    "<hr style='border-top: 1px solid #ccc;'/>" +
//                    "Copyright by" +
//                    "<img src='cid:footerImage' alt='Logo' style='height: 20px; margin-right: 8px;'/>" +
//                    "<span style='font-weight: 500; margin-left: 8px;'>DevoPro</span>" +
//                    "</div>" +
//                    "</div>";
//
//            helper.setTo(user.getUserEmail());
//            helper.setSubject("Appointment Accepted");
//            helper.setText(htmlContent, true);
//
//            FileSystemResource res = new FileSystemResource(new File("C:\\\\Users\\\\blanc\\\\Downloads\\\\clickandwin.png"));
//            helper.addInline("logoImage", res);
//
//            FileSystemResource footerResource = new FileSystemResource(new File("C:\\Users\\blanc\\Downloads\\clickandwin.png"));
//            helper.addInline("footerImage", footerResource);
//
//            emailSender.send(mimeMessage);
//        } catch (MessagingException e) {
//            e.printStackTrace();
//            // Handle the exception appropriately
//        }
//    }
public Appointment acceptAppointment(Long appointmentId) {
    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

    appointment.acceptAppointment();
    appointmentRepository.save(appointment);

    sendAppointmentAcceptanceEmail(appointment.getUser(), appointment);

    return appointment;
}
    public void sendAppointmentCreatedEmailToAllUsers(List<User> users, Appointment appointment) {
        for (User user : users) {
            try {
                MimeMessage mimeMessage = emailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");

                String htmlContent = "<div style='font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 2px solid #ccc;'>" +
                        "<table width='100%'><tr><td></td><td style='text-align:right;'>" +
                        "<img src='cid:logoImage' alt='Your Logo' style='width: 150px;'>" +
                        "</td></tr></table>" +
                        "<h1 style='color: #333366;'>Hello " + user.getUserName() + ",</h1>" +
                        "<hr style='border-top: 1px solid #ccc;'/>" +
                        "<p style='font-size: 18px;'>A new appointment has been scheduled on <strong>" + appointment.getDateTime() + "</strong>.</p>" +
                        "<p style='font-size: 18px;'>You can now log in to view more details or express interest.</p>" +
                        "<br/>" +
                        "<p style='font-size: 18px;'>Thank you,</p>" +
                        "<p style='font-size: 18px;'>Bahja Association Team</p>" +
                        "<div class='layout-footer' style='margin-top: 20px;'>" +
                        "<hr style='border-top: 1px solid #ccc;'/>" +
                        "Copyright by" +
                        "<img src='cid:footerImage' alt='Logo' style='height: 20px; margin-right: 8px;'/>" +
                        "<span style='font-weight: 500; margin-left: 8px;'>Bahja</span>" +
                        "</div>" +
                        "</div>";

                helper.setTo(user.getUserEmail());
                helper.setSubject("New Appointment Scheduled");
                helper.setText(htmlContent, true);

                FileSystemResource res = new FileSystemResource(new File("uploads/bahja.png"));
                helper.addInline("logoImage", res);

                FileSystemResource footerResource = new FileSystemResource(new File("uploads/bahja.png"));
                helper.addInline("footerImage", footerResource);

                emailSender.send(mimeMessage);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
    }

    private void sendAppointmentAcceptanceEmail(User user, Appointment appointment) {
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");

            String htmlContent = "<div style='font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 2px solid #ccc;'>" +
                    "<table width='100%'><tr><td></td><td style='text-align:right;'>" +
                    "<img src='cid:logoImage' alt='Your Logo' style='width: 150px;'>" +
                    "</td></tr></table>" +
                    "<h1 style='color: #333366;'>Hello " + user.getUserName() + ",</h1>" +
                    "<hr style='border-top: 1px solid #ccc;'/>" +
                    "<p style='font-size: 18px;'>Your appointment on <strong>" + appointment.getDateTime() + "</strong> has been accepted.</p>" +
                    "<p style='font-size: 18px;'>You can now log in to check the appointment details.</p>" +
                    "<br/>" +
                    "<p style='font-size: 18px;'>Thank you,</p>" +
                    "<p style='font-size: 18px;'>Your App Team</p>" +
                    "<div class='layout-footer' style='margin-top: 20px;'>" +
                    "<hr style='border-top: 1px solid #ccc;'/>" +
                    "Copyright by" +
                    "<img src='cid:footerImage' alt='Logo' style='height: 20px; margin-right: 8px;'/>" +
                    "<span style='font-weight: 500; margin-left: 8px;'>DevoPro</span>" +
                    "</div>" +
                    "</div>";

            helper.setTo(user.getUserEmail());
            helper.setSubject("Appointment Accepted");
            helper.setText(htmlContent, true);

            FileSystemResource res = new FileSystemResource(new File("uploads/dricon.png"));
            helper.addInline("logoImage", res);

            FileSystemResource footerResource = new FileSystemResource(new File("uploads/dricon.png"));
            helper.addInline("footerImage", footerResource);

            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    public Appointment addMember(Long appointmentId, String userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        appointment.getMembers().add(user);
        return appointmentRepository.save(appointment);
    }

    public Appointment addInterested(Long appointmentId, String userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        appointment.getInterested().add(user);
        return appointmentRepository.save(appointment);
    }

   /* public List<AppointmentDTO> getAllAppointmentDTOs() {
        List<Appointment> appointments = appointmentRepository.findAll();

        return appointments.stream().map(app -> {
            List<UserDTO> memberDTOs = app.getMembers().stream()
                    .map(member -> new UserDTO(
                            member.getUserName(),
                            member.getUserFirstName(),
                            member.getUserLastName(),
                            member.getUserEmail(),
                            member.getPhoneNumber(),
                            member.getLocation(),
                            member.getBirthDate()
                    )).collect(Collectors.toList());
            List<UserDTO> interestedDTOs = app.getMembers().stream()
                    .map(member -> new UserDTO(
                            member.getUserName(),
                            member.getUserFirstName(),
                            member.getUserLastName(),
                            member.getUserEmail(),
                            member.getPhoneNumber(),
                            member.getLocation(),
                            member.getBirthDate()
                    )).collect(Collectors.toList());
            return new AppointmentDTO(
                    app.getId(),
                    app.getDateTime(),
                    app.getStatus(),
                    app.getDescription(),
                    app.getMessage(),
                    memberDTOs,
                    interestedDTOs
            );
        }).collect(Collectors.toList());
    }


    public AppointmentDTO toDTO(Appointment app) {
        List<UserDTO> memberDTOs = app.getMembers().stream()
                .map(member -> new UserDTO(
                        member.getUserName(),
                        member.getUserFirstName(),
                        member.getUserLastName(),
                        member.getUserEmail(),
                        member.getPhoneNumber(),
                        member.getLocation(),
                        member.getBirthDate()
                )).collect(Collectors.toList());
        List<UserDTO> interstedDTOs = app.getMembers().stream()
                .map(member -> new UserDTO(
                        member.getUserName(),
                        member.getUserFirstName(),
                        member.getUserLastName(),
                        member.getUserEmail(),
                        member.getPhoneNumber(),
                        member.getLocation(),
                        member.getBirthDate()
                )).collect(Collectors.toList());
        return new AppointmentDTO(
                app.getId(),
                app.getDateTime(),
                app.getStatus(),
                app.getDescription(),
                app.getMessage(),
                memberDTOs,
                interstedDTOs
        );
    }*/
   public List<AppointmentDTO> getAllAppointmentDTOs() {
       List<Appointment> appointments = appointmentRepository.findAll();

       return appointments.stream().map(app -> {
           List<UserDTO> memberDTOs = app.getMembers().stream()
                   .map(this::convertToUserDTO)
                   .collect(Collectors.toList());

           List<UserDTO> interestedDTOs = app.getInterested().stream()
                   .map(this::convertToUserDTO)
                   .collect(Collectors.toList());

           return new AppointmentDTO(
                   app.getId(),
                   app.getDateTime(),
                   app.getStatus(),
                   app.getDescription(),
                   app.getMessage(),
                   memberDTOs,
                   interestedDTOs
           );
       }).collect(Collectors.toList());
   }

    private UserDTO convertToUserDTO(User user) {
        return new UserDTO(
                user.getUserName(),
                user.getUserFirstName(),
                user.getUserLastName(),
                user.getUserEmail(),
                user.getPhoneNumber(),
                user.getLocation(),
                user.getBirthDate()
        );
    }
    public AppointmentDTO toDTO(Appointment app) {
        List<UserDTO> memberDTOs = app.getMembers().stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());

        List<UserDTO> interestedDTOs = app.getInterested().stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());

        return new AppointmentDTO(
                app.getId(),
                app.getDateTime(),
                app.getStatus(),
                app.getDescription(),
                app.getMessage(),
                memberDTOs,
                interestedDTOs
        );
    }
}