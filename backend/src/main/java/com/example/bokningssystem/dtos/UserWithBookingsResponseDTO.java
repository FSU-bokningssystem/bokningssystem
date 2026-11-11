package com.example.bokningssystem.dtos;

import java.util.List;

public record UserWithBookingsResponseDTO(
        long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String timeZone,
        List<BookingForUserResponseDTO> bookings
) {
}