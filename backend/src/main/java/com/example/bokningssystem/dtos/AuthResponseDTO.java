package com.example.bokningssystem.dtos;

public record AuthResponseDTO(
        String token,
        Long userId,
        String email,
        String userRole
) {}
