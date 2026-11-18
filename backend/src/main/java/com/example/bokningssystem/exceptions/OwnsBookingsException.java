package com.example.bokningssystem.exceptions;

public class OwnsBookingsException extends RuntimeException {
    public OwnsBookingsException(String message) {
        super(message);
    }
}
