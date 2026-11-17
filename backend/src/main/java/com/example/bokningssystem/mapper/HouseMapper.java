package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.entities.House;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HouseMapper {
    private final RoomMapper roomMapper;
    private final UserMapper userMapper;

    public HouseMapper(RoomMapper roomMapper, UserMapper userMapper) {
        this.roomMapper = roomMapper;
        this.userMapper = userMapper;
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

    public HouseDTO toHouseDTO(House house) {
        List<RoomDTO> rooms = house.getRooms().stream()
                .map(roomMapper::toDTO)
                .toList();
        List<UserShortResponseDTO> owners = house.getOwners().stream()
                .map(userMapper::userShortResponseDTO)
                .toList();

        return new HouseDTO(
                house.getId(),
                house.getName(),
                house.getStreet(),
                house.getStreetNumber(),
                house.getZipcode(),
                house.getCity(),
                house.getTimeZone(),
                rooms,
                owners
        );
    }
}
