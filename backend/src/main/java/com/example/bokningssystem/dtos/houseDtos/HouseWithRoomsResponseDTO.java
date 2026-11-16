package com.example.bokningssystem.dtos.houseDtos;

import com.example.bokningssystem.dtos.roomDtos.RoomResponseDTO;

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
