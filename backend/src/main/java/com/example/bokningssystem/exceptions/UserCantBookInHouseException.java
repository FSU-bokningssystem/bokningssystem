package com.example.bokningssystem.exceptions;

public class UserCantBookInHouseException extends RuntimeException {
    public UserCantBookInHouseException(String message) {
        super(message);
    }
}
