package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.CreateUserProfileDTO;
import com.example.bokningssystem.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(CreateUserProfileDTO dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhoneNumber());
        return user;
    }
}