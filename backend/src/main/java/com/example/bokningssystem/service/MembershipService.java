package com.example.bokningssystem.service;


import com.example.bokningssystem.dtos.MembershipResponseDTO;
import com.example.bokningssystem.entities.Membership;
import com.example.bokningssystem.exceptions.UserNotFoundException;
import com.example.bokningssystem.repository.MembershipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MembershipService {
    private final MembershipRepository membershipRepository;


    public MembershipService(MembershipRepository membershipRepository) {
        this.membershipRepository = membershipRepository;
    }

    @Transactional(readOnly = true)
    public List<MembershipResponseDTO> findMembership(long userId) {
        return membershipRepository.findAllByUserId(userId).stream()
                .map(m -> new MembershipResponseDTO(
                        userId,
                        m.getOrganization().getId(),
                        m.getOrganization().getName(),
                        m.getMemberRole()))
                .toList();
    }
}
