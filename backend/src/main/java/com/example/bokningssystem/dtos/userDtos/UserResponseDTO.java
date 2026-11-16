package com.example.bokningssystem.dtos.userDtos;

public record UserResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String timeZone
) {
}