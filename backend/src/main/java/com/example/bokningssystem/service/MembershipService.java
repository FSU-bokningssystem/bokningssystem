package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.membershipDtos.MembershipResponseDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrgMemberDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Membership;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.entities.Organization;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.enums.MemberRole;
import com.example.bokningssystem.exceptions.*;
import com.example.bokningssystem.repository.MembershipRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.bokningssystem.repository.OrganizationRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class MembershipService {
    private final MembershipRepository membershipRepository;
    private final BookingService bookingService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public MembershipService(
            MembershipRepository membershipRepository,
            BookingService bookingService,
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            UserService userService) {
        this.membershipRepository = membershipRepository;
        this.bookingService = bookingService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
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

    @Transactional(readOnly = true)
    public List<OrgMemberDTO> findMembersOfOrganization(long orgId) {
        return membershipRepository.findAllByOrganizationId(orgId).stream()
                .map(m -> new OrgMemberDTO(
                        m.getUser().getId(),
                        m.getUser().getFirstName(),
                        m.getUser().getLastName(),
                        m.getMemberRole()))
                .toList();
    }

    @Transactional
    public MembershipResponseDTO addUserToOrganization(long actorId, long targetId, long orgId, MemberRole role) {
        Membership actor = membershipRepository.findByUserIdAndOrganizationId(actorId, orgId)
                .orElseThrow(() -> new ForbiddenException(
                        "Användare " + actorId + " är inte medlem i organisationen " + orgId
                ));

        if (actor.getMemberRole() != MemberRole.OWNER && actor.getMemberRole() != MemberRole.ADMIN) {
            throw new ForbiddenException("Endast ägare eller admin kan lägga till medlemmar");
        }

        if (membershipRepository.findByUserIdAndOrganizationId(targetId, orgId).isPresent()) {
            throw new IllegalArgumentException("Användaren är redan medlem i organisationen");
        }

        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Användaren hittades inte"));
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organisationen hittades inte"));

        // Säkerställ att max en person är OWNER samtidigt
        if (role == MemberRole.OWNER) {
            List<Membership> currentOwners = membershipRepository.findAllByOrganizationId(orgId).stream()
                    .filter(m -> m.getMemberRole() == MemberRole.OWNER)
                    .toList();
            for (Membership oldOwner : currentOwners) {
                oldOwner.setMemberRole(MemberRole.MEMBER);
                membershipRepository.save(oldOwner);
            }
        }

        Membership newMembership = new Membership();
        newMembership.setUser(targetUser);
        newMembership.setOrganization(org);
        newMembership.setMemberRole(role != null ? role : MemberRole.MEMBER);
        membershipRepository.save(newMembership);

        return new MembershipResponseDTO(targetId, orgId, org.getName(), newMembership.getMemberRole());
    }

    @Transactional
    public void transferOwnership(long actorId, long newOwnerId, long orgId) {
        Membership actor = membershipRepository.findByUserIdAndOrganizationId(actorId, orgId)
                .orElseThrow(() -> new ForbiddenException(
                        "Användare " + actorId + " är inte medlem i organisationen " + orgId
                ));

        if (actor.getMemberRole() != MemberRole.OWNER && actor.getMemberRole() != MemberRole.ADMIN) {
            throw new ForbiddenException("Endast ägare eller admin kan lämna över organisationen");
        }

        Membership newOwner = membershipRepository.findByUserIdAndOrganizationId(newOwnerId, orgId)
                .orElseThrow(() -> new MembershipNotFoundException(
                        "Användare " + newOwnerId + " är inte medlem i organisationen " + orgId
                ));

        List<Membership> currentOwners = membershipRepository.findAllByOrganizationId(orgId).stream()
                .filter(m -> m.getMemberRole() == MemberRole.OWNER)
                .toList();
        for (Membership oldOwner : currentOwners) {
            oldOwner.setMemberRole(MemberRole.MEMBER);
            membershipRepository.save(oldOwner);
        }

        newOwner.setMemberRole(MemberRole.OWNER);
        membershipRepository.save(newOwner);
    }

    @Transactional
    public MembershipResponseDTO addUserToOrganizationByEmail(String actorEmail, long targetId, long orgId, MemberRole role) {
        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new ForbiddenException("Inloggad användare hittades inte"));
        return addUserToOrganization(actor.getId(), targetId, orgId, role);
    }

    @Transactional
    public void transferOwnershipByEmail(String actorEmail, long newOwnerId, long orgId) {
        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new ForbiddenException("Inloggad användare hittades inte"));
        transferOwnership(actor.getId(), newOwnerId, orgId);
    }

    @Transactional
    public void removeUserFromOrganization(long targetId, long orgId, boolean anonymize){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User actorUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Inloggad användare hittades inte"));
        long actorId = actorUser.getId();

        Membership actor = membershipRepository.findByUserIdAndOrganizationId(actorId, orgId)
                .orElseThrow(() -> new ForbiddenException(
                        "Användare " + actorId + " är inte medlem i organisationen " + orgId
                ));
        Membership target = membershipRepository.findByUserIdAndOrganizationId(targetId, orgId)
                .orElseThrow(() -> new MembershipNotFoundException(
                        "Användare " + targetId + " är inte medlem i organisationen " + orgId
                ));


    if( actorId != targetId && !canRemove(actor.getMemberRole(), target.getMemberRole())){
        throw new ForbiddenException("Du har inte behörighet att ta bort denna användare");
    }
    // om användarens profil ska tas bort
    if (anonymize){
        if(actorId == targetId){
            throw new ForbiddenException("Du får inte anonymisera dig själv!");

        }
        if (membershipRepository.findAllByUserId(targetId).size() > 1 ){
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

        if(anonymize){
            userService.anonymizeUser(targetId);
        }
    }

    private boolean canRemove(MemberRole actorRole, MemberRole targetRole){
        return switch (actorRole){
            case OWNER -> true;
            case ADMIN -> targetRole == MemberRole.MEMBER;
            case MEMBER -> false;
        };
    }
}
