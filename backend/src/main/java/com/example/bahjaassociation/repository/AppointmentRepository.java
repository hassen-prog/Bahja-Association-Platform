package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.Appointment;
import com.example.bahjaassociation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser(User user);
    List<Appointment> findByUser_UserName(String userName);
    List<Appointment> findByStatus(String status);


}
