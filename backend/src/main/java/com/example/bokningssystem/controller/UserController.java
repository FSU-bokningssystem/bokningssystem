package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.service.UserContextService;
import com.example.bokningssystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(allowCredentials = "true",
        originPatterns = {"http://localhost:*"})
@RestController
@RequestMapping("/user")
@Validated
public class UserController {
    private final UserService userService;
    private final UserContextService userContextService;

    public UserController(UserService userService, UserContextService userContextService) {
        this.userService = userService;
        this.userContextService = userContextService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/withbookings/{id}")
    public ResponseEntity<UserWithBookingsResponseDTO> getUserWithBookingsById (@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserWithBookings(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> editUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRegistrationDTO dto
    ) {
        UserResponseDTO editedUser = userService.editUserProfile(id, dto);
        return ResponseEntity.ok(editedUser);
    }

    @GetMapping("me/context")
    public ResponseEntity<InitialResponseDTO> getUserContext(@RequestParam(required = false) Long selectedOrgId) {
        return ResponseEntity.ok(userContextService.getInitialDataForUser(selectedOrgId));
    }
}