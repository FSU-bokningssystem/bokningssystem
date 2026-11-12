package com.example.bokningssystem.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TransferOwnerDTO(@NotNull @Positive Long newOwnerId) {
}
