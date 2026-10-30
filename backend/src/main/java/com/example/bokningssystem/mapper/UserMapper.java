package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.UserResponseDTO;
import com.example.bokningssystem.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponseDTO toResponseDTO (User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getTimeZone()
        );
    }
}
