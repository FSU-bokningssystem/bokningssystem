package com.example.bokningssystem.dtos.bookingDtos;

import com.example.bokningssystem.dtos.userDtos.UserResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public record BookingResponseDTO(
        long id,
        String title,
        String description,
        LocalDateTime startTime,
        LocalDateTime endTime,
        long houseId,
        String houseName,
        String roomNumber,
        String roomName,
        UserResponseDTO owner,
        List<UserResponseDTO> participants) {
}
