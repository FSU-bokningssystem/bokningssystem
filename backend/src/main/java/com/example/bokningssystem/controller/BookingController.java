package com.example.bokningssystem.controller;


import com.example.bokningssystem.dtos.BookingShortResponseDTO;
import com.example.bokningssystem.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@CrossOrigin(allowCredentials = "true",
        originPatterns = {"http://localhost:*"})
@RestController
@RequestMapping("/bookings")
@Validated
class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }


    @GetMapping
    public ResponseEntity<List<BookingShortResponseDTO>> findAll(){
        return ResponseEntity.ok(bookingService.findAll());
    }
}