package com.example.bokningssystem.dtos.bookingDtos;

import java.time.Instant;

public record BookingDTO(
        Long id,
        String title,
        String description,
        Instant startTime,
        Integer duration,
        Long roomId,
        String roomName,
        Long ownerId
) {}
