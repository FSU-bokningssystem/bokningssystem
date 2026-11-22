package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.roomDtos.RoomCreateDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomResponseDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomUpdateDTO;
import com.example.bokningssystem.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(allowCredentials = "true",
        originPatterns = {"http://localhost:*"})
@RestController
@RequestMapping("/room")
@Validated
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<RoomResponseDTO> create(@Valid @RequestBody RoomCreateDTO createDTO) {
        RoomResponseDTO room = roomService.create(createDTO);
        return ResponseEntity.ok(room);
    }
    @PutMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> update(@PathVariable Long id,
                                                  @Valid @RequestBody RoomUpdateDTO updateDTO) {
        return ResponseEntity.ok(roomService.update(id, updateDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
