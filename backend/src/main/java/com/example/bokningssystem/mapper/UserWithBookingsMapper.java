package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.BookingForUserResponseDTO;
import com.example.bokningssystem.dtos.UserWithBookingsResponseDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.User;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Set;

@Component
public class UserWithBookingsMapper {
    private final BookingMapper bookingMapper;

    public UserWithBookingsMapper(BookingMapper bookingMapper) {
        this.bookingMapper = bookingMapper;
    }

    public UserWithBookingsResponseDTO toUserWithBookingsResponseDTO (User user) {
        Set<Booking> bookings = user.getOwnedBookings();
        bookings.addAll(user.getParticipatingBookings());
        return new UserWithBookingsResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getTimeZone(),
                bookings.stream()
                        .map(bookingMapper::toBookingForUserResponseDTO)
                        .sorted(Comparator.comparing(BookingForUserResponseDTO::startTime))
                        .toList()
        );
    }


}
