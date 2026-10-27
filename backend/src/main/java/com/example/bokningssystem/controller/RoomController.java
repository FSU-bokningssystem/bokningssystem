package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.RoomCreateDTO;
import com.example.bokningssystem.dtos.RoomResponseDTO;
import com.example.bokningssystem.entities.Room;
import com.example.bokningssystem.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(allowCredentials = "true",
        originPatterns = {"http://localhost:*"})
@RestController
@RequestMapping("/room")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<RoomResponseDTO> create(@RequestBody RoomCreateDTO createDTO) {
        RoomResponseDTO room = roomService.create(createDTO);
        return ResponseEntity.ok(room);
    }
}
