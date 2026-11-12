package com.example.bokningssystem.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(HouseNotFoundException.class)
    public ResponseEntity<ErrorResponse> houseNotFound(HouseNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage());
        return ResponseEntity.status(404).body(error);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> houseNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage());
        return ResponseEntity.status(404).body(error);
    }

    @ExceptionHandler(RoomInHouseNotFoundException.class)
    public ResponseEntity<ErrorResponse> roomInHouseNotFound(RoomInHouseNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage());
        return ResponseEntity.status(404).body(error);
    }

    @ExceptionHandler(TimeOrderException.class)
    public ResponseEntity<ErrorResponse> timeOrderException(TimeOrderException ex) {
        ErrorResponse error = new ErrorResponse(400, ex.getMessage());
        return ResponseEntity.status(400).body(error);
    }

    @ExceptionHandler(RoomOccupiedException.class)
    public ResponseEntity<ErrorResponse> roomOccupiedException(RoomOccupiedException ex) {
        ErrorResponse error = new ErrorResponse(400, ex.getMessage());
        return ResponseEntity.status(400).body(error);
    }

    @ExceptionHandler(RoomNotAvailableException.class)
    public ResponseEntity<ErrorResponse> roomNotAvailableException(RoomNotAvailableException ex) {
        ErrorResponse error = new ErrorResponse(400, ex.getMessage());
        return ResponseEntity.status(400).body(error);
    }

    @ExceptionHandler(InvalidTimeZoneException.class)
    public ResponseEntity<ErrorResponse> invalidTimeZoneException(InvalidTimeZoneException ex) {
        ErrorResponse error = new ErrorResponse(400, ex.getMessage());
        return ResponseEntity.status(400).body(error);
    }


    // Valideringsfel - @Valid mysslyckades
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (existing, replacement) -> existing // behåll första felet om ett fält har flera
                ));

        String message = String.join(", ", fieldErrors.values());

        ErrorResponse error = new ErrorResponse(400, message, fieldErrors);
        return ResponseEntity.status(400).body(error);
    }

    // Affärsregelfel, t.ex. lösenord matchar inte / e-post upptagen
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(400, ex.getMessage());
        return ResponseEntity.status(400).body(error);
    }


    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<ErrorResponse> roomNotFound(RoomNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage());
        return ResponseEntity.status(404).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> dataIntegrityViolation(DataIntegrityViolationException ex) {
        ErrorResponse error = new ErrorResponse(409,
                "Det finns redan en lokal med detta rumsnummer på den våningen.");
        return ResponseEntity.status(409).body(error);
    }
    @ExceptionHandler(MembershipNotFoundException.class)
    public ResponseEntity<ErrorResponse> membershipNotFound(MembershipNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
    }

    @ExceptionHandler(LastOwnerException.class)
    public ResponseEntity<ErrorResponse> lastOwner(LastOwnerException ex) {
        return ResponseEntity.status(409).body(new ErrorResponse(409, ex.getMessage()));
    }
    @ExceptionHandler(OwnsBookingsException.class)
    public ResponseEntity<ErrorResponse> ownsBooking(OwnsBookingsException ex){
        return ResponseEntity.status(409).body(new ErrorResponse(409, ex.getMessage()));
    }


    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<ErrorResponse> bookingNotFound(BookingNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
    }
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> forbidden(ForbiddenException ex) {
        return ResponseEntity.status(403).body(new ErrorResponse( 403, ex.getMessage()));
    }
}
