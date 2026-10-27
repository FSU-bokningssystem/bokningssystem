package com.example.bokningssystem.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(HouseNotFoundException.class)
    public ResponseEntity<ErrorResponse> houseNotFound(HouseNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage());
            return ResponseEntity.status(404).body(error);
        }

    }
