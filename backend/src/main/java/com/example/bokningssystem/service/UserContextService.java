package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.bookingDtos.BookingResponseDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrganizationDetailDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrganizationSummaryDTO;
import com.example.bokningssystem.dtos.userDtos.InitialResponseDTO;
import com.example.bokningssystem.dtos.userDtos.UserResponseDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Credential;
import com.example.bokningssystem.entities.Membership;
import com.example.bokningssystem.entities.Organization;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.enums.MemberRole;
import com.example.bokningssystem.exceptions.ForbiddenException;
import com.example.bokningssystem.mapper.BookingMapper;
import com.example.bokningssystem.mapper.OrganizationMapper;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.repository.CredentialRepository;
import com.example.bokningssystem.repository.MembershipRepository;
import com.example.bokningssystem.repository.OrganizationRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
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

    public UserContextService(
            UserRepository userRepository,
            UserMapper userMapper,
            MembershipRepository membershipRepository,
            OrganizationRepository organizationRepository,
            OrganizationMapper organizationMapper,
            BookingMapper bookingMapper,
            CredentialRepository credentialRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.membershipRepository = membershipRepository;
        this.organizationRepository = organizationRepository;
        this.organizationMapper = organizationMapper;
        this.bookingMapper = bookingMapper;
        this.credentialRepository = credentialRepository;
    }

    /** Hämtar den inloggade användaren från SecurityContext. */
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ForbiddenException("Ingen inloggad användare hittades.");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Användare hittades inte: " + auth.getName()));
    }

    /** Kontrollerar att inloggad användare är medlem i organisationen. */
    @Transactional(readOnly = true)
    public Membership requireMembership(long orgId) {
        User currentUser = getCurrentUser();
        return membershipRepository.findByUserIdAndOrganizationId(currentUser.getId(), orgId)
                .orElseThrow(() -> new ForbiddenException(
                        "Användare " + currentUser.getId() + " är inte medlem i organisationen " + orgId
                ));
    }

    /** Kontrollerar att inloggad användare har någon av de angivna rollerna i organisationen. */
    @Transactional(readOnly = true)
    public Membership requireOrgRole(long orgId, MemberRole... allowedRoles) {
        Membership membership = requireMembership(orgId);
        boolean hasRole = Arrays.asList(allowedRoles).contains(membership.getMemberRole());
        if (!hasRole) {
            throw new ForbiddenException("Du saknar nödvändig roll i organisationen för att utföra denna åtgärd.");
        }
        return membership;
    }

    /** Kontrollerar att inloggad användare är bokningsägare ELLER OWNER/ADMIN i bokningens organisation. */
    @Transactional(readOnly = true)
    public User requireBookingModifyAccess(Booking booking) {
        User currentUser = getCurrentUser();

        if (Objects.equals(booking.getOwner().getId(), currentUser.getId())) {
            return currentUser;
        }

        Long orgId = booking.getRoom().getHouse().getOrganization().getId();
        boolean isOrgOwnerOrAdmin = membershipRepository
                .findByUserIdAndOrganizationId(currentUser.getId(), orgId)
                .map(m -> m.getMemberRole() == MemberRole.OWNER || m.getMemberRole() == MemberRole.ADMIN)
                .orElse(false);

        if (!isOrgOwnerOrAdmin) {
            throw new ForbiddenException("Endast bokningsägaren eller husägaren kan utföra denna åtgärd.");
        }
        return currentUser;
    }

    /** Kontrollerar att inloggad användare har systemrollen ADMIN. */
    @Transactional(readOnly = true)
    public User requireSystemAdmin() {
        User currentUser = getCurrentUser();
        boolean isSystemAdmin = credentialRepository.findById(currentUser.getId())
                .map(c -> "ADMIN".equalsIgnoreCase(c.getRole()))
                .orElse(false);

        if (!isSystemAdmin) {
            throw new ForbiddenException("Endast systemadministratörer har behörighet att utföra denna åtgärd.");
        }
        return currentUser;
    }

    /** Kontrollerar att inloggad användare antingen är den aktuella användaren ELLER systemadmin. */
    @Transactional(readOnly = true)
    public User requireSelfOrSystemAdmin(long targetUserId) {
        User currentUser = getCurrentUser();
        if (Objects.equals(currentUser.getId(), targetUserId)) {
            return currentUser;
        }

        boolean isSystemAdmin = credentialRepository.findById(currentUser.getId())
                .map(c -> "ADMIN".equalsIgnoreCase(c.getRole()))
                .orElse(false);

        if (!isSystemAdmin) {
            throw new ForbiddenException("Du har inte behörighet att redigera denna användare.");
        }
        return currentUser;
    }

    @Transactional(readOnly = true)
    public InitialResponseDTO getInitialDataForUser(Long selectedOrgId) {
        User user = getCurrentUser();
        UserResponseDTO userDto = userMapper.toResponseDTO(user);

        String userRole = credentialRepository.findById(user.getId())
                .map(Credential::getRole)
                .orElse("USER");

        List<Membership> userMemberShips = membershipRepository.findByUserId(user.getId());

        List<OrganizationSummaryDTO> orgSummaries = userMemberShips.stream()
                .map(m -> new OrganizationSummaryDTO(
                        m.getOrganization().getId(),
                        m.getOrganization().getName(),
                        m.getMemberRole()))
                .toList();

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

        OrganizationDetailDTO activeOrgDTO = null;
        if (targetOrgId != null) {
            Organization organization = organizationRepository.findById(targetOrgId)
                    .orElseThrow(() -> new IllegalArgumentException("Organisation hittades inte"));
            activeOrgDTO = organizationMapper.toDetailDTO(organization);
        }

        List<BookingResponseDTO> bookingDTOs = Stream.concat(
                        user.getOwnedBookings().stream(),
                        user.getParticipatingBookings().stream())
                .distinct()
                .map(bookingMapper::toBookingResponseDTO)
                .toList();

        return new InitialResponseDTO(userDto, orgSummaries, activeOrgDTO, bookingDTOs, userRole);
    }
}