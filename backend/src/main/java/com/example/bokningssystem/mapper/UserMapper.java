package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.entities.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper {
    private final BookingMapper bookingMapper;

    private static final String DEFAULT_TIME_ZONE = "Europe/Stockholm";

    public UserMapper(BookingMapper bookingMapper) {
        this.bookingMapper = bookingMapper;
    }

    public User toEntity(CreateUserProfileDTO dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhoneNumber());

        String tz = dto.getTimeZone();
        user.setTimeZone(tz == null || tz.isBlank() ? DEFAULT_TIME_ZONE : tz);
        return user;
    }


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

    public UserShortResponseDTO userShortResponseDTO (User user) {
        return new UserShortResponseDTO(user.getFirstName(),user.getLastName(),user.getEmail());
    }

    public UserWithBookingsResponseDTO (User user) {
        List<BookingForUserResponseDTO> bookings = user.getB
        return new UserWithBookingsResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getTimeZone(),

        )
    }
}
