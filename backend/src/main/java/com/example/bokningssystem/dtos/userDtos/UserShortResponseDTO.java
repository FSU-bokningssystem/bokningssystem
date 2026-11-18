package com.example.bokningssystem.dtos.userDtos;

public record UserShortResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email
) {
}