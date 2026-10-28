package com.example.bahjaassociation.dto.Appointment;

import com.example.bahjaassociation.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data

@NoArgsConstructor
public class AppointmentDTO {
    private Long id;
    private LocalDateTime dateTime;
    private String status;
    private String description;
    private String message;
    private List<UserDTO> members;
    private List<UserDTO> interested;
    public AppointmentDTO(Long id, LocalDateTime dateTime, String status, String description,
                          String message, List<UserDTO> members, List<UserDTO> interested) {
        this.id = id;
        this.dateTime = dateTime;
        this.status = status;
        this.description = description;
        this.message = message;
        this.members = members;
        this.interested = interested;
    }
}
