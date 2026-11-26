package com.example.bokningssystem.dtos.bookingDtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record BookingAvailabilityDTO(
        @NotNull @Positive(message="Bokningen måste höra till ett hus.")
        Long houseId,

        @NotNull(message="Bokningen måste ha ett datum eller en start-tid.")
        LocalDateTime startTime,

        // Null om användaren bara valt ett datum, ifylld om exakt tid angivits
        LocalDateTime endTime
) {
}
