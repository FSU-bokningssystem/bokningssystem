package com.example.bokningssystem.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RoomUpdateDTO(
        @NotBlank(message = "Rumsnummer får inte vara blankt.")
        String roomNumber,

        Integer floor,

        @NotBlank(message = "Rumsnamn får inte vara blankt.")
        String name,

        @NotBlank(message = "Beskrivning får inte vara blank.")
        String description,

        @NotNull(message = "Tillgänglighet måste anges.")
        Boolean isAvailable) {
}