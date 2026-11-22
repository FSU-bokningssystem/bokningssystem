package com.example.bokningssystem.dtos.membershipDtos;

import com.example.bokningssystem.enums.MemberRole;

public record AddMemberRequestDTO(
        Long userId,
        Long organizationId,
        MemberRole role
) {}