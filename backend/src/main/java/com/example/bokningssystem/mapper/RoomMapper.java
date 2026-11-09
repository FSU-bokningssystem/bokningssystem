package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.RoomCreateDTO;
import com.example.bokningssystem.dtos.RoomDTO;
import com.example.bokningssystem.dtos.RoomResponseDTO;
import com.example.bokningssystem.dtos.RoomUpdateDTO;
import com.example.bokningssystem.entities.House;
import com.example.bokningssystem.entities.Room;
import com.example.bokningssystem.exceptions.HouseNotFoundException;
import com.example.bokningssystem.repository.HouseRepository;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {
    private final HouseRepository houseRepository;

    public RoomMapper(HouseRepository houseRepository) {
        this.houseRepository = houseRepository;
    }

    public Room fromCreateDTO (RoomCreateDTO createDTO) {
        House house = houseRepository.findById(createDTO.houseId())
                .orElseThrow(() -> new HouseNotFoundException("Hittar inte hus med id: "+createDTO.houseId()));
        return new Room(
                createDTO.roomNumber(),
                createDTO.floor(),
                createDTO.name(),
                createDTO.description(),
                house);
    }

    public RoomResponseDTO toResponseDTO (Room room) {
        return new RoomResponseDTO(
                room.getId(),
                room.getRoomNumber(),
                room.getFloor(),
                room.getName(),
                room.getDescription(),
                room.getHouse().getName(),
                room.getIsAvailable());
    }

    public RoomDTO toDTO(Room room) {
        if (room == null) return null;

        return new RoomDTO(
                room.getId(),
                room.getRoomNumber(),
                room.getFloor(),
                room.getName(),
                room.getDescription(),
                room.getIsAvailable()
        );
    }

    public void updateFromDTO(Room room, RoomUpdateDTO updateDTO) {
        room.setRoomNumber(updateDTO.roomNumber());
        room.setFloor(updateDTO.floor());
        room.setName(updateDTO.name());
        room.setDescription(updateDTO.description());
        room.setIsAvailable(updateDTO.isAvailable());
    }
}
