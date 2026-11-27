package com.example.bokningssystem.dtos.houseDtos;

import java.util.List;

public record HouseCreationDTO(
        String name,
        String street,
        String streetNumber,
        String zipCode,
        String city,
        String timeZone,
        Long organizationId,
        List<Long> ownerIds
) {}
