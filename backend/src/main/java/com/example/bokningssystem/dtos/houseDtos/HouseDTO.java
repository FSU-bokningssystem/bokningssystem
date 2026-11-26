package com.example.bokningssystem.dtos.houseDtos;

import com.example.bokningssystem.dtos.organizationDtos.OrganizationShortDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomDTO;
import com.example.bokningssystem.dtos.userDtos.UserShortResponseDTO;

import java.util.List;

public record HouseDTO(
        Long id,
        String name,
        String street,
        String streetNumber,
        String zipCode,
        String city,
        String timeZone,
        Long organisationId,
        String organizationName,
        List<RoomDTO> rooms,
        List<UserShortResponseDTO> owners
) {}
