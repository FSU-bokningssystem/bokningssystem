package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.RoomCreateDTO;
import com.example.bokningssystem.dtos.RoomResponseDTO;
import com.example.bokningssystem.dtos.RoomUpdateDTO;
import com.example.bokningssystem.entities.House;
import com.example.bokningssystem.entities.Room;
import com.example.bokningssystem.exceptions.HouseNotFoundException;
import com.example.bokningssystem.exceptions.RoomNotFoundException;
import com.example.bokningssystem.mapper.RoomMapper;
import com.example.bokningssystem.repository.HouseRepository;
import com.example.bokningssystem.repository.RoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final HouseRepository houseRepository;
    private final RoomMapper roomMapper;

    public RoomService(RoomRepository roomRepository, HouseRepository houseRepository, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.houseRepository = houseRepository;
        this.roomMapper = roomMapper;
    }

    public RoomResponseDTO create (RoomCreateDTO roomDTO) {
        return roomMapper.toResponseDTO(roomRepository.save(roomMapper.fromCreateDTO(roomDTO)));
    }

    @Transactional
    public RoomResponseDTO update(Long id, RoomUpdateDTO updateDTO) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Hittar inte lokal med id: " + id));

        roomMapper.updateFromDTO(room, updateDTO);
        return roomMapper.toResponseDTO(roomRepository.saveAndFlush(room));
    }
}
