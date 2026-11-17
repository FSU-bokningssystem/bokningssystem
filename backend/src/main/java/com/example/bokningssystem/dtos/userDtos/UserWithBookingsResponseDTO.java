package com.example.bokningssystem.dtos.userDtos;

import com.example.bokningssystem.dtos.bookingDtos.BookingForUserResponseDTO;

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