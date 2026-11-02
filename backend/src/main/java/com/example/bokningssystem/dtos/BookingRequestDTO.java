package com.example.bokningssystem.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record BookingRequestDTO(
        @NotNull(message="Bokningen måste höra till ett hus.")
        long houseId,

        @NotNull @NotBlank (message="Bokningen måste höra till ett rum.")
        String roomNumber,

        @NotNull @NotBlank (message="Bokningen måste ha en titel.")
        String title,

        @NotNull @NotBlank (message="Bokningen måste ha en beskrivning.")
        String description,

        @NotNull (message="Bokningen måste ha en start-tid.")
        LocalDateTime startTime,

        @NotNull (message="Bokningen måste ha en slut-tid.")
        LocalDateTime endTime,

        @NotNull @Positive (message="Bokningen måste ha en ägare.")
        long ownerId
) {
}
