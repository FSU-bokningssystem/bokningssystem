package com.example.bokningssystem.dtos;

import com.example.bokningssystem.enums.MemberRole;

public record OrganizationSummaryDTO(
        Long id,
        String name,
        MemberRole role
) {}
