package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserMapper() {}

    private static final String DEFAULT_TIME_ZONE = "Europe/Stockholm";

    public User toEntity(UserRegistrationDTO dto) {
        User user = new User();
        updateEntityFromDto(user, dto);
        return user;
    }

    public void updateEntityFromDto(User user, UserRegistrationDTO dto) {
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setPhone(dto.phone());

        String tz = dto.timeZone();
        user.setTimeZone(tz == null || tz.isBlank() ? DEFAULT_TIME_ZONE : tz);
    }

    public UserResponseDTO toResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getTimeZone()
        );
    }

    public UserShortResponseDTO userShortResponseDTO (User user) {
        return new UserShortResponseDTO(user.getFirstName(),user.getLastName(),user.getEmail());
    }
}