package com.example.bokningssystem.exceptions;

public class CantMoveBookingOutsideOrganizationException extends RuntimeException {
    public CantMoveBookingOutsideOrganizationException(String message) {
        super(message);
    }
}
