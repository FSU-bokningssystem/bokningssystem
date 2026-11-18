package com.example.bokningssystem.dtos.organizationDtos;

import java.util.List;

public record OrganizationCreateDTO(
        Long id,
        String name,
        Long organizationHostId,
        List<Long> memberUserIds
) {}