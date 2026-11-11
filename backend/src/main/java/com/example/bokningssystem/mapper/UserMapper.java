package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Set;


@Component
public class UserMapper {

    public UserMapper() {


    }

    private static final String DEFAULT_TIME_ZONE = "Europe/Stockholm";



    public User toEntity(CreateUserProfileDTO dto) {
        User user = new User();
        updateEntityFromDto(user, dto);
        return user;
    }

    public void updateEntityFromDto(User user, CreateUserProfileDTO dto) {
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhoneNumber());

        String tz = dto.getTimeZone();
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