package com.example.bahjaassociation.service;


import com.example.bahjaassociation.entity.RegistrationRequest;
import com.example.bahjaassociation.entity.Role;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.RoleRepository;
import com.example.bahjaassociation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.transaction.Transactional;
import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private JavaMailSender emailSender;




    public User registerUser(RegistrationRequest request) {
        User newUser = new User();
        newUser.setUserName(request.getUsername());
        newUser.setUserEmail(request.getEmail());
        newUser.setUserPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setUserFirstName(request.getUserFirstName());
        newUser.setUserLastName(request.getUserLastName());
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setLocation(request.getLocation());
        newUser.setBirthDate(request.getBirthDate());
        Role userRole = roleRepository.findByRoleName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Error: Role not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        newUser.setRole(roles);
        return userRepository.save(newUser);
    }


    public User findByUsername(String username) {
        return userRepository.findByUserName(username);
    }



    public String getEncodedPassword(String password) {
        return passwordEncoder.encode(password);
    }




    public void initiatePasswordReset(String userEmail) {
        User user = userRepository.findByUserEmail(userEmail);

        if (user == null) {
            throw new IllegalArgumentException("No user associated with this email");
        }

        String resToken = UUID.randomUUID().toString();
        user.setResetToken(resToken);
        user.setResetTokenExpiryDate(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour
        userRepository.save(user);

        sendResetPasswordEmail(user, resToken);
    }

private void sendResetPasswordEmail(User user, String resToken) {
    try {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");

        String htmlContent = "<div style='font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 2px solid #ccc;'>" +
                "<table width='100%'><tr><td></td><td style='text-align:right;'>" +
                "<img src='cid:logoImage' alt='Your Logo' style='width: 150px;'>" +
                "</td></tr></table>" +
                "<h1 style='color: #333366;'>Hello " + user.getUserName() + ",</h1>" +
                "<hr style='border-top: 1px solid #ccc;'/>" +
                "<p style='font-size: 18px;'>You requested to reset your password.</p>" +
                "<p style='font-size: 18px;'>Click on the link below to reset your password:</p>" +
                "<p style='font-size: 18px;'><a href='http://localhost:8086/resetPassword/" + resToken + "'>Reset Password</a></p>" +
                "<p style='font-size: 18px;'>If you didn't request this, ignore this email.</p>" +
                "<br/>" +
                "<p style='font-size: 18px;'>Thank you,</p>" +
                "<p style='font-size: 18px;'>Your App Team</p>" +
                "<div class='layout-footer' style='margin-top: 20px;'>" +
                "<img src='cid:footerImage' alt='Logo' style='height: 20px; margin-right: 8px;'/>" +
                "by" +
                "<span style='font-weight: 500; margin-left: 8px;'>Bahja-Asso</span>" +
                "</div>" +
                "</div>";

        helper.setTo(user.getUserEmail());
        helper.setSubject("Password Reset Request");
        helper.setText(htmlContent, true);

        FileSystemResource logoResource = new FileSystemResource(new File("uploads/bahja.png"));
        helper.addInline("logoImage", logoResource);

        // Assuming your footer image is in the same location
        FileSystemResource footerResource = new FileSystemResource(new File("uploads/bahja.png"));
        helper.addInline("footerImage", footerResource);

        emailSender.send(mimeMessage);
    } catch (MessagingException e) {
        e.printStackTrace();
    }
}

    public void resetPassword(String resToken, String newPassword) {
        User user = userRepository.findByResetToken(resToken);
        if (user == null || LocalDateTime.now().isAfter(user.getResetTokenExpiryDate())) {
            throw new IllegalArgumentException("Token is invalid or expired");
        }

        user.setUserPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiryDate(null);
        userRepository.save(user);
    }





    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllUsersWithRoles() {
        return userRepository.findAllWithRoles();
    }
}



