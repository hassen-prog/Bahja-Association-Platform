package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByUserName(String userName);

    User findByUserEmail(String userEmail);
    User findByResetToken(String resetToken);
    @Query("SELECT DISTINCT u FROM User u JOIN FETCH u.role")
    List<User> findAllWithRoles();


}
