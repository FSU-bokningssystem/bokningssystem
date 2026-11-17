package com.example.bokningssystem.dtos;

public record UserShortResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email
) {
}