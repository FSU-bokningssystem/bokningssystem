package com.example.bokningssystem.service;


import com.example.bokningssystem.dtos.MembershipResponseDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Membership;
import com.example.bokningssystem.enums.MemberRole;
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
    public void removeUserFromOrganization(long userId, long orgId){
        Membership membership = membershipRepository.findByUserIdAndOrganizationId(userId, orgId)
                .orElseThrow(() -> new MembershipNotFoundException(
                        "Användare " + userId + " är inte medlem i organisationen " + orgId
                ));
        if (membership.getMemberRole() == MemberRole.OWNER
        && membershipRepository.countByOrganizationIdAndMemberRole(orgId, MemberRole.OWNER) <= 1) {
            throw new LastOwnerException("Kan inte ta bort den enda ägaren av organisationen");
        }
        List<Booking> owned = bookingService.ownedFutureBookings(userId, orgId, Instant.now());
        if (!owned.isEmpty()) {
            throw new OwnsBookingsException(
                    "Användaren äger " + owned.size() + " kommande möten. Ge över dem till någon annan först.");
        }
        bookingService.removeUserFromFutureBookings(userId, orgId);
        membershipRepository.delete(membership);
    }
}
