package com.example.bahjaassociation.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String userName;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
    private String phoneNumber;
    private String location;
    private LocalDate birthDate;
}