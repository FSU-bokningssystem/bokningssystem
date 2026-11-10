package com.example.bokningssystem.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record BookingForUserResponseDTO(
        Long id,
        String title,
        String description,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long houseId,
        String houseName,
        String roomNumber,
        UserShortResponseDTO owner,
        List<UserShortResponseDTO> participants) {
}
