package com.example.bokningssystem.dtos;

import java.util.List;

public record OrganizationCreateDTO(
        Long id,
        String name,
        Long organizationHostId,
        List<Long> memberUserIds
) {}