package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.OrganizationCreateDTO;
import com.example.bokningssystem.dtos.OrganizationDetailDTO;
import com.example.bokningssystem.entities.Membership;
import com.example.bokningssystem.entities.Organization;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.enums.MemberRole;
import com.example.bokningssystem.mapper.OrganizationMapper;
import com.example.bokningssystem.repository.MembershipRepository;
import com.example.bokningssystem.repository.OrganizationRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final OrganizationMapper organizationMapper;

    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository,
                               MembershipRepository membershipRepository,
                               OrganizationMapper organizationMapper) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.organizationMapper = organizationMapper;
    }

    @Transactional
    public OrganizationDetailDTO createOrganization(OrganizationCreateDTO dto) {
        // 1. Validera host-användaren
        User hostUser = userRepository.findById(dto.organizationHostId())
                .orElseThrow(() -> new IllegalArgumentException("Hittade ingen host med ID: " + dto.organizationHostId()));

        // 2. Skapa och spara organisationen
        Organization organization = new Organization(dto.name());
        Organization savedOrganization = organizationRepository.save(organization);

        // 3. Skapa ägar-medlemskapet (OWNER)
        Membership hostMembership = new Membership(hostUser, savedOrganization, MemberRole.OWNER);
        membershipRepository.save(hostMembership);

        // 4. Skapa vanliga medlemskap (MEMBER) om listan inte är tom
        if (dto.memberUserIds() != null && !dto.memberUserIds().isEmpty()) {
            for (Long memberId : dto.memberUserIds()) {
                // Undvik att lägga till hosten dubbelt om den valts i båda fälten
                if (!memberId.equals(dto.organizationHostId())) {
                    userRepository.findById(memberId).ifPresent(user -> {
                        Membership memberMembership = new Membership(user, savedOrganization, MemberRole.MEMBER);
                        membershipRepository.save(memberMembership);
                    });
                }
            }
        }

        return organizationMapper.toDetailDTO(savedOrganization);
    }
}