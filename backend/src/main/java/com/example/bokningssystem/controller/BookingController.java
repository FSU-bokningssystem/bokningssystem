package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.BookingRequestDTO;
import com.example.bokningssystem.dtos.BookingResponseDTO;
import com.example.bokningssystem.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(allowCredentials = "true",
        originPatterns = {"http://localhost:*"})
@RestController
@RequestMapping("/booking")
@Validated
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> create (@Valid @RequestBody BookingRequestDTO requestDTO) {
        return ResponseEntity.ok(bookingService.create(requestDTO));
    }
}
