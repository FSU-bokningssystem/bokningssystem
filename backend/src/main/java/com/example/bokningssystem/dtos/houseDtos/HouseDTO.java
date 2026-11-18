package com.example.bokningssystem.dtos.houseDtos;

import com.example.bokningssystem.dtos.roomDtos.RoomDTO;

import java.util.List;

public record HouseDTO(
        Long id,
        String name,
        String street,
        String streetNumber,
        String zipCode,
        String city,
        String timeZone,
        List<RoomDTO> rooms,
        List<UserShortResponseDTO> owners
) {}
