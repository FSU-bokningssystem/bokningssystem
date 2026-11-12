package com.example.bokningssystem.dtos;

import java.util.List;

public record UserOrgBookingsDTO (
    List<BookingResponseDTO> owned,
    List<BookingResponseDTO> participating
){}
