package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.roomDtos.RoomCreateDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomResponseDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomUpdateDTO;
import com.example.bokningssystem.entities.Room;
import com.example.bokningssystem.exceptions.RoomNotFoundException;
import com.example.bokningssystem.mapper.RoomMapper;
import com.example.bokningssystem.repository.BookingRepository;
import com.example.bokningssystem.repository.HouseRepository;
import com.example.bokningssystem.repository.RoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final HouseRepository houseRepository;
    private final RoomMapper roomMapper;
    private final BookingRepository bookingRepository;

    public RoomService(RoomRepository roomRepository, HouseRepository houseRepository, RoomMapper roomMapper, BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.houseRepository = houseRepository;
        this.roomMapper = roomMapper;
        this.bookingRepository = bookingRepository;
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

    @Transactional
    public void delete(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Hittar inte lokal med id: " + id));

        bookingRepository.deleteByRoomId(id);
        roomRepository.delete(room);
    }
}
