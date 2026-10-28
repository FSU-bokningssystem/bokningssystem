package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.HouseShortResponseDTO;
import com.example.bokningssystem.service.HouseService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

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
}
