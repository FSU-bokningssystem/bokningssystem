package com.example.bokningssystem.dtos.organizationDtos;

import com.example.bokningssystem.dtos.houseDtos.HouseDTO;
import com.example.bokningssystem.dtos.userDtos.UserShortResponseDTO;

import java.util.List;

public record OrganizationDetailDTO(
        Long id,
        String name,
        List<HouseDTO> houses,
        List<UserShortResponseDTO> users
) {
}
