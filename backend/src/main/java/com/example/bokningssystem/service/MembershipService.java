package com.example.bokningssystem.service;


import com.example.bokningssystem.dtos.MembershipResponseDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Membership;
import com.example.bokningssystem.enums.MemberRole;
import com.example.bokningssystem.exceptions.ForbiddenException;
import com.example.bokningssystem.exceptions.LastOwnerException;
import com.example.bokningssystem.exceptions.MembershipNotFoundException;
import com.example.bokningssystem.exceptions.OwnsBookingsException;
import com.example.bokningssystem.repository.MembershipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class MembershipService {
    private final MembershipRepository membershipRepository;
    private final BookingService bookingService;


    public MembershipService(MembershipRepository membershipRepository, BookingService bookingService) {
        this.membershipRepository = membershipRepository;
        this.bookingService = bookingService;
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

    @Transactional
    public void removeUserFromOrganization(long actorId, long targetId, long orgId){
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
    }


    private boolean canRemove(MemberRole actorRole, MemberRole targetRole){
        return switch (actorRole){
            case OWNER -> true;
            case ADMIN -> targetRole == MemberRole.MEMBER;
            case MEMBER -> false;
        };
    }
}
