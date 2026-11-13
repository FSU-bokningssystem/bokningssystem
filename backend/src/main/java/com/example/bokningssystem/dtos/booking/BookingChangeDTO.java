package com.example.bokningssystem.dtos.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record BookingChangeDTO(
        @NotNull @Positive(message="Bokningen måste redan finnas.")
        Long id,

        String roomNumber,

        String title,

        String description,

        LocalDateTime startTime,

        LocalDateTime endTime,

        Long ownerId) {
}
