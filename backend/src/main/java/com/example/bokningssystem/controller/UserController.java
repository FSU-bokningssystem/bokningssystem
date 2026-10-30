package com.example.bokningssystem.controller;


import com.example.bokningssystem.dtos.UserResponseDTO;
import com.example.bokningssystem.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@CrossOrigin(allowCredentials = "true",
        originPatterns = {"http://localhost:*"})
@RestController

public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAll(){
        return ResponseEntity.ok(userService.getAll());
    }
}
