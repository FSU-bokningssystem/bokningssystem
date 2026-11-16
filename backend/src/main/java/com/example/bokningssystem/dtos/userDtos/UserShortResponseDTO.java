package com.example.bokningssystem.dtos.userDtos;

public record UserShortResponseDTO(
        String firstName,
        String lastName,
        String email
) {
}