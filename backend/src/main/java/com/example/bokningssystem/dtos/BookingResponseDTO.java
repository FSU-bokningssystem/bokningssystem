package com.example.bokningssystem.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record BookingResponseDTO(
        long id,
        String title,
        String description,
        LocalDateTime startTime,
        LocalDateTime endTime,
        long houseId,
        String roomNumber,
        UserResponseDTO owner,
        List<UserResponseDTO> participants) {
}
