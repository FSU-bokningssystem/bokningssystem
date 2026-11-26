package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.membershipDtos.MembershipResponseDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrgMemberDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Membership;
import com.example.bokningssystem.entities.Organization;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.enums.MemberRole;
import com.example.bokningssystem.exceptions.*;
import com.example.bokningssystem.repository.MembershipRepository;
import com.example.bokningssystem.repository.OrganizationRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Service
public class MembershipService {
    private final MembershipRepository membershipRepository;
    private final BookingService bookingService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final UserContextService userContextService;

    public MembershipService(
            MembershipRepository membershipRepository,
            BookingService bookingService,
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            UserService userService,
            UserContextService userContextService) {
        this.membershipRepository = membershipRepository;
        this.bookingService = bookingService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.userContextService = userContextService;
    }

    @Transactional(readOnly = true)
    public List<MembershipResponseDTO> findMembership(long userId) {
        User currentUser = userContextService.getCurrentUser();
        if (!Objects.equals(userId, currentUser.getId())) {
            throw new ForbiddenException("Du kan endast se dina egna medlemskap.");
        }

        return membershipRepository.findAllByUserId(userId).stream()
                .map(m -> new MembershipResponseDTO(
                        userId,
                        m.getOrganization().getId(),
                        m.getOrganization().getName(),
                        m.getMemberRole()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrgMemberDTO> findMembersOfOrganization(long orgId) {
        userContextService.requireMembership(orgId);

        return membershipRepository.findAllByOrganizationId(orgId).stream()
                .map(m -> new OrgMemberDTO(
                        m.getUser().getId(),
                        m.getUser().getFirstName(),
                        m.getUser().getLastName(),
                        m.getMemberRole()))
                .toList();
    }

    @Transactional
    public MembershipResponseDTO addUserToOrganization(long targetId, long orgId, MemberRole role) {
        Membership actor = userContextService.requireOrgRole(orgId, MemberRole.OWNER, MemberRole.ADMIN);
        MemberRole assignedRole = (role != null) ? role : MemberRole.MEMBER;

        if (actor.getMemberRole() == MemberRole.ADMIN && assignedRole != MemberRole.MEMBER) {
            throw new ForbiddenException("En admin kan endast lägga till användare med rollen MEMBER.");
        }

        if (membershipRepository.findByUserIdAndOrganizationId(targetId, orgId).isPresent()) {
            throw new IllegalArgumentException("Användaren är redan medlem i organisationen.");
        }

        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new UserNotFoundException("Användaren hittades inte."));
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organisationen hittades inte."));

        if (assignedRole == MemberRole.OWNER) {
            demoteCurrentOwners(orgId);
        }

        Membership newMembership = new Membership(targetUser, org, assignedRole);
        membershipRepository.save(newMembership);

        return new MembershipResponseDTO(targetId, orgId, org.getName(), newMembership.getMemberRole());
    }

    @Transactional
    public void transferOwnership(long newOwnerId, long orgId) {
        userContextService.requireOrgRole(orgId, MemberRole.OWNER);

        Membership newOwner = membershipRepository.findByUserIdAndOrganizationId(newOwnerId, orgId)
                .orElseThrow(() -> new MembershipNotFoundException(
                        "Användare " + newOwnerId + " är inte medlem i organisationen " + orgId
                ));

        demoteCurrentOwners(orgId);

        newOwner.setMemberRole(MemberRole.OWNER);
        membershipRepository.save(newOwner);
    }

    @Transactional
    public void removeUserFromOrganization(long targetId, long orgId, boolean anonymize) {
        Membership actor = userContextService.requireMembership(orgId);
        long actorId = actor.getUser().getId();

        Membership target = membershipRepository.findByUserIdAndOrganizationId(targetId, orgId)
                .orElseThrow(() -> new MembershipNotFoundException(
                        "Användare " + targetId + " är inte medlem i organisationen " + orgId
                ));

        if (actorId != targetId && !canRemove(actor.getMemberRole(), target.getMemberRole())) {
            throw new ForbiddenException("Du har inte behörighet att ta bort denna användare.");
        }

        if (anonymize) {
            if (actorId == targetId) {
                throw new ForbiddenException("Du får inte anonymisera dig själv!");
            }
            if (membershipRepository.findAllByUserId(targetId).size() > 1) {
                throw new HasOtherMembershipsException("Användaren är med i andra organisationer!");
            }
        }

        if (target.getMemberRole() == MemberRole.OWNER
                && membershipRepository.countByOrganizationIdAndMemberRole(orgId, MemberRole.OWNER) <= 1) {
            throw new LastOwnerException("Kan inte ta bort den enda ägaren av organisationen");
        }

        List<Booking> owned = bookingService.ownedFutureBookings(targetId, orgId, Instant.now());
        if (!owned.isEmpty()) {
            throw new OwnsBookingsException(
                    "Användaren äger " + owned.size() + " kommande möten. Ge över dem till någon annan först.");
        }

        bookingService.removeUserFromFutureBookings(targetId, orgId);
        membershipRepository.delete(target);

        if (anonymize) {
            userService.anonymizeUser(targetId);
        }
    }

    private void demoteCurrentOwners(long orgId) {
        List<Membership> currentOwners = membershipRepository.findAllByOrganizationId(orgId).stream()
                .filter(m -> m.getMemberRole() == MemberRole.OWNER)
                .toList();
        for (Membership oldOwner : currentOwners) {
            oldOwner.setMemberRole(MemberRole.MEMBER);
            membershipRepository.save(oldOwner);
        }
    }

    private boolean canRemove(MemberRole actorRole, MemberRole targetRole) {
        return switch (actorRole) {
            case OWNER -> true;
            case ADMIN -> targetRole == MemberRole.MEMBER;
            case MEMBER -> false;
        };
    }
}