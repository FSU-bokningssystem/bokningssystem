package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByOwnerIdOrUsersId(Long ownerId, Long userId);

    List<Booking> findByRoomId(Long roomId);
}

