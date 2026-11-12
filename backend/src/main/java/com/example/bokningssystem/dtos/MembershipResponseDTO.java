package com.example.bokningssystem.dtos;

import com.example.bokningssystem.enums.MemberRole;

public record MembershipResponseDTO(
        Long userId,
        Long organizationId,
        String organizationName,
        MemberRole memberRole) {
}
