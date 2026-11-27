package com.example.bokningssystem.dtos.bookingDtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

import java.time.LocalDateTime;

public record BookingRequestDTO(
        @NotNull @Positive (message="Bokningen måste höra till ett hus.")
        Long houseId,

        @NotNull @NotBlank (message="Bokningen måste höra till ett rum.")
        String roomNumber,

        @NotNull @NotBlank (message="Bokningen måste ha en titel.")
        String title,

        String description,

        @NotNull (message="Bokningen måste ha en start-tid.")
        LocalDateTime startTime,

        @NotNull (message="Bokningen måste ha en slut-tid.")
        LocalDateTime endTime,

        @NotNull @Positive (message="Bokningen måste ha en ägare.")
        Long ownerId,

        List<@NotNull @Positive Long> participantIds
) {
}


