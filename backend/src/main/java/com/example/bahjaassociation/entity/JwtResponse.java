package com.example.bahjaassociation.entity;

import lombok.*;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JwtResponse {
    private User user;
    private String jwtToken;

}
