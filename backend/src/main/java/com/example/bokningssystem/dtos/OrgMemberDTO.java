package com.example.bokningssystem.dtos;

import com.example.bokningssystem.enums.MemberRole;

public record OrgMemberDTO(
        Long userId,
        String firstName,
        String lastName,
        MemberRole memberRole) {
}
