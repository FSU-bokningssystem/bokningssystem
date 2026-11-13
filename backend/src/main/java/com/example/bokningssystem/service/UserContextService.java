package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.entities.*;
import com.example.bokningssystem.mapper.BookingMapper;
import com.example.bokningssystem.mapper.OrganizationMapper;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Stream;

@Service
public class UserContextService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final MembershipRepository membershipRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationMapper organizationMapper;
    private final BookingMapper bookingMapper;
    private final CredentialRepository credentialRepository;

    public UserContextService(UserRepository userRepository, UserMapper userMapper, MembershipRepository membershipRepository,
                              OrganizationRepository organizationRepository, OrganizationMapper organizationMapper,
                              BookingMapper bookingMapper, CredentialRepository credentialRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.membershipRepository = membershipRepository;
        this.organizationRepository = organizationRepository;
        this.organizationMapper = organizationMapper;
        this.bookingMapper = bookingMapper;
        this.credentialRepository = credentialRepository;
    }

    @Transactional(readOnly = true)
    public InitialResponseDTO getInitialDataForUser(Long selectedOrgId) {

        // Hämta e-posten för den inloggade användaren direkt från Spring Security
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Slå upp användaren via e-posten från token
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Användare hittades inte"));

        UserResponseDTO userDto = userMapper.toResponseDTO(user);

        // Hämta systemrollen från Credential (med "USER" som fallback om den saknas)
        String userRole = credentialRepository.findById(user.getId())
                .map(Credential::getRole)
                .orElse("USER");

        // Hämta ALLA organisationer användaren är medlem i
        List<Membership> userMemberShips = membershipRepository.findByUserId(user.getId());

        List<OrganizationSummaryDTO> orgSummaries = userMemberShips.stream()
                .map(m -> new OrganizationSummaryDTO(
                        m.getOrganization().getId(),
                        m.getOrganization().getName(),
                        m.getMemberRole()))
                .toList();

        /* Bestäm vilken organisation som ska vara aktiv. Standardval är första organisationen
        i listan över användarens organisationer*/
        boolean isMember = selectedOrgId != null && userMemberShips.stream()
                .anyMatch(m -> m.getOrganization().getId().equals(selectedOrgId));

        Long targetOrgId;
        if (isMember) {
            targetOrgId = selectedOrgId;
        } else if (!userMemberShips.isEmpty()) {
            targetOrgId = userMemberShips.get(0).getOrganization().getId();
        } else {
            targetOrgId = null;
        }

        // Hämta och mappa den aktiva organisationen med hus och rum
        OrganizationDetailDTO activeOrgDTO = null;
        if (targetOrgId != null) {
            Organization organization = organizationRepository.findById(targetOrgId)
                    .orElseThrow(() -> new RuntimeException("Organisation hittades inte"));
            activeOrgDTO = organizationMapper.toDetailDTO(organization);
        }

        // Hämta användarens alla bokningar
        List<BookingResponseDTO> bookingDTOs = Stream.concat(
                        user.getOwnedBookings().stream(),
                        user.getParticipatingBookings().stream())
                .distinct()
                .map(bookingMapper::toBookingResponseDTO)
                .toList();

        return new InitialResponseDTO(userDto, orgSummaries, activeOrgDTO, bookingDTOs, userRole);
    }
}
