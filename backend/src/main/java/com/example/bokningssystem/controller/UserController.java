package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.CreateUserProfileDTO;
import com.example.bokningssystem.entities.User;

import com.example.bokningssystem.dtos.UserResponseDTO;
import com.example.bokningssystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAll(){
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody CreateUserProfileDTO dto) {
        User createdUser = userService.createUserProfile(dto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
}