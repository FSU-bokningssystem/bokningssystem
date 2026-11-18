package com.example.bokningssystem.dtos.membershipDtos;

import com.example.bokningssystem.enums.MemberRole;

public record MembershipResponseDTO(
        Long userId,
        Long organizationId,
        String organizationName,
        MemberRole memberRole) {
}
