package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.HouseShortResponseDTO;
import com.example.bokningssystem.dtos.HouseWithRoomsResponseDTO;
import com.example.bokningssystem.dtos.RoomResponseDTO;
import com.example.bokningssystem.entities.House;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HouseMapper {
    private final RoomMapper roomMapper;

    public HouseMapper(RoomMapper roomMapper) {
        this.roomMapper = roomMapper;
    }

    public HouseShortResponseDTO toHouseShortResponseDTO (House house) {
        return new HouseShortResponseDTO(house.getId(), house.getName(), house.getStreet(), house.getStreetNumber(), house.getZipcode(), house.getCity(), house.getOrganization().getName(), house.getTimeZone());
    }

    public HouseWithRoomsResponseDTO toHouseWithRoomsResponseDTO (House house) {
        List<RoomResponseDTO> rooms = house.getRooms()
                .stream()
                .map(roomMapper::toResponseDTO)
                .toList();
        return new HouseWithRoomsResponseDTO(
                house.getId(),
                house.getName(),
                house.getStreet(),
                house.getStreetNumber(),
                house.getZipcode(),
                house.getCity(),
                house.getOrganization().getName(),
                house.getTimeZone(),
                rooms);

    }
}
