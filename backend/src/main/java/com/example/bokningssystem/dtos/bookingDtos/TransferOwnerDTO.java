package com.example.bokningssystem.dtos.bookingDtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TransferOwnerDTO(@NotNull @Positive Long newOwnerId) {
}
