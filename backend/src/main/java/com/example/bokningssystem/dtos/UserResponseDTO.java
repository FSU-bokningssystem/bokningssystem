package com.example.bokningssystem.dtos;

public record UserResponseDTO(
    long id,
    String firstName,
    String lastName,
    String email,
    String phone,
    String time_zone) {
}
