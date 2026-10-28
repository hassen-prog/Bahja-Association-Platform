package com.example.bahjaassociation.service;


import com.example.bahjaassociation.entity.Role;
import com.example.bahjaassociation.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleDao;

    public Role createNewRole(Role role) {
        return roleDao.save(role);

    }



    public List<Role> getAllRoles() {
        return roleDao.findAll();
    }




}
