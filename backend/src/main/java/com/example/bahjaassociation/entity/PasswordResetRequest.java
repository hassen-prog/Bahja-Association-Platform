package com.example.bahjaassociation.entity;

public class PasswordResetRequest {


    private String resToken;
    private String newPassword;


    public String getResToken() {
        return resToken;
    }

    public void setResToken(String resToken) {
        this.resToken = resToken;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    // Optional: You can also add a constructor, equals, hashCode, and toString methods if needed
}