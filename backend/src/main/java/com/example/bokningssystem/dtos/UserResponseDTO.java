package com.example.bokningssystem.dtos;

public record UserResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String timeZone
) {
}