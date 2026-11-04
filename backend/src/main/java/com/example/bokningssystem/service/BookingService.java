package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.BookingRequestDTO;
import com.example.bokningssystem.dtos.BookingResponseDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.exceptions.RoomNotAvailableException;
import com.example.bokningssystem.exceptions.RoomOccupiedException;
import com.example.bokningssystem.mapper.BookingMapper;
import com.example.bokningssystem.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;

    public BookingService(BookingMapper bookingMapper, BookingRepository bookingRepository) {
        this.bookingMapper = bookingMapper;
        this.bookingRepository = bookingRepository;
    }

    public BookingResponseDTO create(BookingRequestDTO requestDTO){
        Booking newBooking = bookingMapper.fromBookingRequestDTO(requestDTO);
        if(!newBooking.getRoom().getIsAvailable()) throw new RoomNotAvailableException(
                "Rum " + requestDTO.roomNumber() + " går inte att boka.");
        List<Booking> futureBookings = newBooking.getRoom().getBookings()
                .stream()
                .filter(booking->booking.getEndTime().isAfter(Instant.now()))
                .toList();
        for(Booking futureBooking: futureBookings) {
            if(futureBooking.overlapsWith(newBooking.getStartTime(), newBooking.getEndTime())) {
                LocalDateTime start = LocalDateTime.ofInstant(futureBooking.getStartTime(), futureBooking.getRoom().getHouse().getActualTimeZone());
                LocalDateTime end =  LocalDateTime.ofInstant(futureBooking.getEndTime(), futureBooking.getRoom().getHouse().getActualTimeZone());
                throw new RoomOccupiedException(
                        "Rum " + requestDTO.roomNumber() + " är bokat " + start + " till " + end + ".");
            }
        }
        return bookingMapper.toBookingResponseDTO(bookingRepository.save(newBooking));
    }
}
