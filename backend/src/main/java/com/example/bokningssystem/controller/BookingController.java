package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.bookingDtos.BookingRequestDTO;
import com.example.bokningssystem.dtos.bookingDtos.BookingResponseDTO;
import com.example.bokningssystem.dtos.bookingDtos.TransferOwnerDTO;
import com.example.bokningssystem.dtos.bookingDtos.UserOrgBookingsDTO;
import com.example.bokningssystem.dtos.bookingDtos.BookingChangeDTO;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.service.BookingService;
import com.example.bokningssystem.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(allowCredentials = "true",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE
        },
        originPatterns = "http://localhost:[*]")
@RestController
@RequestMapping("/booking")
@Validated
public class BookingController {
    private final BookingService bookingService;
    private final UserService userService;

    public BookingController(BookingService bookingService, UserService userService) {
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> create (@Valid @RequestBody BookingRequestDTO requestDTO, @AuthenticationPrincipal UserDetails auth) {
        User loggedInUser = userService.getUserFromAuth(auth);
        return ResponseEntity.ok(bookingService.create(requestDTO, loggedInUser));
    }

    @PutMapping
    public ResponseEntity<BookingResponseDTO> change (@Valid @RequestBody BookingChangeDTO changeDTO) {
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
    public ResponseEntity<Void> delete(@PathVariable @NotNull @Positive long id){
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
}
