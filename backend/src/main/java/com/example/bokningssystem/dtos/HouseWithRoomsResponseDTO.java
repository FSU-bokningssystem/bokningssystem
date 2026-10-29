package com.example.bokningssystem.dtos;

import java.util.List;

public record HouseWithRoomsResponseDTO(
        Long id,
        String name,
        String street,
        String streetNumber,
        String zipCode,
        String city,
        String organizationName,
        String timeZone,
        List<RoomResponseDTO> rooms
    ) {
}
