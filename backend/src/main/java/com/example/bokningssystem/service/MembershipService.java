package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.membershipDtos.MembershipResponseDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrgMemberDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Membership;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.enums.MemberRole;
import com.example.bokningssystem.exceptions.*;
import com.example.bokningssystem.repository.MembershipRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
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


    public MembershipService(MembershipRepository membershipRepository, UserRepository userRepository, BookingService bookingService, UserService userService) {
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.bookingService = bookingService;
        this.userService = userService;
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
