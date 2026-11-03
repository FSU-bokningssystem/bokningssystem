package com.example.bokningssystem.dtos;

import java.time.Instant;

public record UserResponseDTO(
        long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String timeZone
) {
}