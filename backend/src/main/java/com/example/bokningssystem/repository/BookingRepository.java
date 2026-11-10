package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRoomId(Long roomId);
    List<Booking> findByOwnerIdAndRoomHouseOrganizationIdAndStartTimeAfter(
            Long ownerId, Long organizationId, Instant now);

    List<Booking> findByUsersIdAndRoomHouseOrganizationIdAndStartTimeAfter(
            Long userId, Long organizationId, Instant now);
}
