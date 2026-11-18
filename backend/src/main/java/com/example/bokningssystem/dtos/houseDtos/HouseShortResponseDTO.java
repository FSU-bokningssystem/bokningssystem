package com.example.bokningssystem.dtos.houseDtos;

public record HouseShortResponseDTO(
        Long id,
        String name,
        String street,
        String streetNumber,
        String zipCode,
        String city,
        String organizationName,
        String timeZone) {
}
