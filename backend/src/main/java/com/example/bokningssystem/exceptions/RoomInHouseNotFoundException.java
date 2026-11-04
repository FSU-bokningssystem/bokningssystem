package com.example.bokningssystem.exceptions;

public class RoomInHouseNotFoundException extends RuntimeException {
    public RoomInHouseNotFoundException(String message) {
        super(message);
    }
}
