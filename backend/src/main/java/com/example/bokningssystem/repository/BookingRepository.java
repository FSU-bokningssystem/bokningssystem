package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
