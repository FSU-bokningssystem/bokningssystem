package com.example.bokningssystem.dtos.organizationDtos;

import com.example.bokningssystem.enums.MemberRole;

public record OrgMemberDTO(
        Long userId,
        String firstName,
        String lastName,
        MemberRole memberRole) {
}
