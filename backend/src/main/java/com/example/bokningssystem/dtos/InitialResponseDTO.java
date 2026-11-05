package com.example.bokningssystem.dtos;

import java.util.List;

public record InitialResponseDTO(
        UserResponseDTO user,
        List<OrganizationSummaryDTO> userOrganizations,
        OrganizationDetailDTO activeOrganization,
        List<BookingDTO> bookings
) {}
