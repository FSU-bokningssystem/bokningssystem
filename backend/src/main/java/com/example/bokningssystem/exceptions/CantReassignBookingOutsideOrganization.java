package com.example.bokningssystem.exceptions;

public class CantReassignBookingOutsideOrganization extends RuntimeException {
    public CantReassignBookingOutsideOrganization(String message) {
        super(message);
    }
}
