package com.example.bokningssystem.exceptions;

public class RoomOccupiedException extends RuntimeException {
    public RoomOccupiedException(String message) {
        super(message);
    }
}
