package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.BookingDTO;
import com.example.bokningssystem.entities.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingDTO toDTO(Booking booking) {
        if (booking == null) return null;

        return new BookingDTO(
                booking.getId(),
                booking.getTitle(),
                booking.getDescription(),
                booking.getStartTime(),
                booking.getDuration(),
                booking.getRoom().getId(),
                booking.getRoom().getName(),
                booking.getOwner().getId()
        );
    }
}
