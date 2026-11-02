package com.example.bokningssystem.dtos;

import java.util.List;

public record HouseDTO(
        Long id,
        String name,
        String street,
        String streetNumber,
        String zipcode,
        String city,
        String timeZone,
        List<RoomDTO> rooms
) {}
