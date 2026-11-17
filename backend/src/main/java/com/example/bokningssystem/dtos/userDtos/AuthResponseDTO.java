package com.example.bokningssystem.dtos.userDtos;

public record AuthResponseDTO(
        String token,
        Long userId,
        String email,
        String userRole
) {}
