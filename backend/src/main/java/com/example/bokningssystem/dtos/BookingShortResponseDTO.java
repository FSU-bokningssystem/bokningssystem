package com.example.bokningssystem.dtos;

import java.time.Instant;
import java.util.Set;

public record BookingShortResponseDTO(
    Long id,
    String title,
    String description,
    Instant startTime,
    RoomResponseDTO room,
    Integer duration,
    UserResponseDTO owner,
    Set<UserResponseDTO> users){

}

