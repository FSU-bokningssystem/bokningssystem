package com.example.bokningssystem.dtos;

import java.util.List;

public record OrganizationDetailDTO(
        Long id,
        String name,
        List<HouseDTO> houses
) {
}
