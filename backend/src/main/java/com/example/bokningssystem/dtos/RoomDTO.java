package com.example.bokningssystem.dtos;

public record RoomDTO(
        Long id,
        String roomNumber,
        Integer floor,
        String name,
        String description,
        boolean isAvailable
) {}
