package com.example.bahjaassociation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "users")
@Entity
public class Role {
    @Id
    private String roleName;
    private String roleDescription;

    @JsonIgnore
    @ManyToMany(mappedBy = "role")
    private Set<User> users = new HashSet<>();
}
