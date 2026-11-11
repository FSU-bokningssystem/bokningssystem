package com.example.bokningssystem.dtos;

public record UserShortResponseDTO(
        String firstName,
        String lastName,
        String email
) {
}