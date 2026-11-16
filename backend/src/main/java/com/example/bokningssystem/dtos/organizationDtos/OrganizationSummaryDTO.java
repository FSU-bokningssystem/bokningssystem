package com.example.bokningssystem.dtos.organizationDtos;

import com.example.bokningssystem.enums.MemberRole;

public record OrganizationSummaryDTO(
        Long id,
        String name,
        MemberRole role
) {}
