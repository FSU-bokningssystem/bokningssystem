package com.example.bokningssystem.dtos;

public record RoomResponseDTO(
        String roomNumber,
        int floor,
        String name,
        String description,
        String houseName,
        boolean available) {
}
