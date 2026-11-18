package com.example.bokningssystem.dtos.roomDtos;

public record RoomResponseDTO(
        long id,
        String roomNumber,
        int floor,
        String name,
        String description,
        String houseName,
        boolean isAvailable) {
}
