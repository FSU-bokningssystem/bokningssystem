package com.example.bokningssystem.exceptions;

public class InvalidTimeZoneException extends RuntimeException {
    public InvalidTimeZoneException(String message) {
        super(message);
    }
}
