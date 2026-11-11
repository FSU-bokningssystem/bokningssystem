package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.InitialResponseDTO;
import com.example.bokningssystem.dtos.CreateUserProfileDTO;
import com.example.bokningssystem.dtos.UserWithBookingsResponseDTO;

import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.dtos.UserResponseDTO;
import com.example.bokningssystem.service.UserContextService;
import com.example.bokningssystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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



    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody CreateUserProfileDTO dto) {
        UserResponseDTO createdUser = userService.createUserProfile(dto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> editUser(
            @PathVariable Long id,
            @Valid @RequestBody CreateUserProfileDTO dto
    ) {
        UserResponseDTO editedUser = userService.editUserProfile(id, dto);
        return ResponseEntity.ok(editedUser);
    }

    @GetMapping("me/context")
    public ResponseEntity<InitialResponseDTO> getInitialData(@RequestParam Long userId,
                                                             @RequestParam(required = false) Long selectedOrgId) {
        InitialResponseDTO responseData = userContextService.getInitialDataForUser(userId, selectedOrgId);
        return ResponseEntity.ok(responseData);
    }
}