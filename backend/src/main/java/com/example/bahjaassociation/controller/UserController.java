package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.PasswordResetRequest;
import com.example.bahjaassociation.entity.RegistrationRequest;
import com.example.bahjaassociation.entity.Role;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.RoleRepository;
import com.example.bahjaassociation.repository.UserRepository;
import com.example.bahjaassociation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;


@RestController
@CrossOrigin

public class UserController {


    @Autowired

    private UserService userService;

    @Autowired

    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;




    @PostConstruct
    public void createAdmin() {
        Role adminRole = roleRepository.findById("Admin").orElse(null);

        if (adminRole == null) {
            Role roleadmin = new Role();
            roleadmin.setRoleName("Admin");
            roleadmin.setRoleDescription("Admin");
            roleRepository.save(roleadmin);
        }
        User admin = new User();
        admin.setUserName("admin");
        admin.setUserFirstName("admin");
        admin.setUserLastName("admin");
        admin.setUserEmail("admin@gmail.com");
        admin.setUserPassword(userService.getEncodedPassword("adminadmin"));
        Role role = roleRepository.findById("Admin").orElseThrow(() -> new RuntimeException("Role not found"));
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(role);
        admin.setRole(userRoles);
        userRepository.save(admin);

    }



    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegistrationRequest registrationRequest) {
        User registeredUser = userService.registerUser(registrationRequest);
        return ResponseEntity.ok(registeredUser);
    }





    @GetMapping("/users-with-roles")
    public List<User> getAllUsersWithRoles() {
        return userService.getAllUsersWithRoles();
    }


    @GetMapping("/allUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }




    @PostMapping("/requestPasswordReset")
    public ResponseEntity<Map<String, String>> requestPasswordReset(@RequestBody Map<String, String> request) {
        String userEmail = request.get("email");
        userService.initiatePasswordReset(userEmail);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset link sent to email");

        return ResponseEntity.ok(response);
    }


    @GetMapping("/resetPassword/{resToken}")
    public void redirectWithUsingRedirectPrefix(HttpServletResponse httpServletResponse, @PathVariable String resToken) throws IOException {
        httpServletResponse.sendRedirect("http://localhost:4200/front/resetPassword/" + resToken);
    }


    @PostMapping("/resetPassword")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody PasswordResetRequest request) {
        userService.resetPassword(request.getResToken(), request.getNewPassword());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successful");

        return ResponseEntity.ok(response);
    }


    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUserName(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // Update user profile
    @PutMapping("/profileEdit")
    public ResponseEntity<User> updateUserProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody User updatedUser) {
        User user = userRepository.findByUserName(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setUserFirstName(updatedUser.getUserFirstName());
//        user.setUserName(updatedUser.getUserName());
        user.setUserLastName(updatedUser.getUserLastName());
        user.setUserEmail(updatedUser.getUserEmail());
        user.setLocation(updatedUser.getLocation());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setBirthDate(updatedUser.getBirthDate());
        // Update other user properties as needed

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

}
