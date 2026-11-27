package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.bookingDtos.*;
import com.example.bokningssystem.service.BookingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(allowCredentials = "true",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.PATCH,
                RequestMethod.DELETE
        },
        originPatterns = "http://localhost:[*]")
@RestController
@RequestMapping("/booking")
@Validated
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> create(@Valid @RequestBody BookingRequestDTO requestDTO) {
        return ResponseEntity.ok(bookingService.create(requestDTO));
    }

    @PutMapping
    public ResponseEntity<BookingResponseDTO> change(@Valid @RequestBody BookingChangeDTO changeDTO) {
        return ResponseEntity.ok(bookingService.change(changeDTO));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> findAll() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<BookingResponseDTO>> findByRoomId(@PathVariable long roomId) {
        return ResponseEntity.ok(bookingService.findByRoomId(roomId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @NotNull @Positive long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/organization/{orgId}")
    public ResponseEntity<UserOrgBookingsDTO> findUserBookingsInOrganization(
            @PathVariable @Positive long userId,
            @PathVariable @Positive long orgId) {
        return ResponseEntity.ok(bookingService.findUserBookingsInOrganization(userId, orgId));
    }

    @PatchMapping("/{bookingId}/owner")
    public ResponseEntity<BookingResponseDTO> transferOwner(
            @PathVariable @Positive long bookingId,
            @Valid @RequestBody TransferOwnerDTO dto) {
        return ResponseEntity.ok(bookingService.transferOwner(bookingId, dto.newOwnerId()));
    }

    @PostMapping("/{bookingId}/participants/{userId}")
    public ResponseEntity<BookingResponseDTO> addParticipant(@PathVariable Long bookingId, @PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.addParticipant(bookingId, userId));
    }

    @DeleteMapping("/{bookingId}/participants/{userId}")
    public ResponseEntity<BookingResponseDTO> removeParticipant(@PathVariable Long bookingId, @PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.removeParticipant(bookingId, userId));
    }
}