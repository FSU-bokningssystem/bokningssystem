package com.example.bokningssystem.dtos.userDtos;

import com.example.bokningssystem.dtos.organizationDtos.OrganizationDetailDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrganizationSummaryDTO;
import com.example.bokningssystem.dtos.bookingDtos.BookingResponseDTO;

import java.util.List;

public record InitialResponseDTO(
        UserResponseDTO user,
        List<OrganizationSummaryDTO> userOrganizations,
        OrganizationDetailDTO activeOrganization,
        List<BookingResponseDTO> bookings
) {}
