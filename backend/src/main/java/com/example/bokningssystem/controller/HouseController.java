package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.houseDtos.HouseCreationDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseShortResponseDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseWithRoomsResponseDTO;
import com.example.bokningssystem.entities.House;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.service.HouseService;
import com.example.bokningssystem.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(allowCredentials = "true",
        originPatterns = {"http://localhost:*"})
@RestController
@RequestMapping("/house")
@Validated
class HouseController {

    private final HouseService houseService;

    public HouseController(HouseService houseService) {
        this.houseService = houseService;
    }

    @GetMapping
    public ResponseEntity<List<HouseShortResponseDTO>> findAll(){
        return ResponseEntity.ok(houseService.findAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity<HouseWithRoomsResponseDTO> findHouse(@Valid @Positive @PathVariable long id){
        return ResponseEntity.ok(houseService.findHouse(id));
    }

    @PostMapping
    public ResponseEntity<HouseDTO> create (@Valid @RequestBody HouseCreationDTO dto, @AuthenticationPrincipal UserDetails auth){
        return ResponseEntity.ok(houseService.create(dto, auth));
    }
}
