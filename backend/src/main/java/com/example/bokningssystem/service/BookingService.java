package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.BookingShortResponseDTO;
import com.example.bokningssystem.mapper.BookingMapper;
import com.example.bokningssystem.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    public BookingService(BookingRepository bookingRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.bookingMapper = bookingMapper;
    }

     @Transactional(readOnly = true)
    public List<BookingShortResponseDTO> findAll() {
        return bookingRepository.findAll().stream().map(bookingMapper::toBookingShortResponseDTO).toList();
    }
}
