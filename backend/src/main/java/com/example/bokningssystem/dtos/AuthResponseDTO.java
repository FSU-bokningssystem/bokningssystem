package com.example.bokningssystem.dtos;


import java.util.List;

public record AuthResponseDTO(
        UserResponseDTO user,
        List<OrganizationSummaryDTO> userOrganizations,
        OrganizationDetailDTO activeOrganization,
        List<BookingDTO> bookings
) {}
