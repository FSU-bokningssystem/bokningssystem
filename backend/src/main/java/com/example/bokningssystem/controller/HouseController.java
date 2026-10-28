package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.HouseShortResponseDTO;
import com.example.bokningssystem.dtos.HouseWithRoomsResponseDTO;
import com.example.bokningssystem.service.HouseService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
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
}
