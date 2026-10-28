package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.Role;
import com.example.bahjaassociation.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/createNewRole")
    public Role createNewRole(@RequestBody Role role) {
        return roleService.createNewRole(role);

    }


    @GetMapping("/all")
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }


}
