package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.houseDtos.HouseCreationDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseShortResponseDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseWithRoomsResponseDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomResponseDTO;
import com.example.bokningssystem.dtos.userDtos.UserShortResponseDTO;
import com.example.bokningssystem.entities.House;
import com.example.bokningssystem.entities.Organization;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.exceptions.InvalidTimeZoneException;
import com.example.bokningssystem.exceptions.OrganizationNotFoundException;
import com.example.bokningssystem.exceptions.UserNotFoundException;
import com.example.bokningssystem.repository.OrganizationRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.util.List;

@Component
public class HouseMapper {
    private final RoomMapper roomMapper;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public HouseMapper(RoomMapper roomMapper,
                       UserMapper userMapper,
                       UserRepository userRepository,
                       OrganizationRepository organizationRepository) {
        this.roomMapper = roomMapper;
        this.userMapper = userMapper;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
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
                house.getOrganization().getId(),
                house.getOrganization().getName(),
                rooms,
                owners
        );
    }

    public House fromCreationDTO(HouseCreationDTO dto) {
        Organization org = organizationRepository.findById(dto.organizationId())
                .orElseThrow(()->new OrganizationNotFoundException("Hittar inte organisation med ID " +  dto.organizationId()+"."));
        try {
            ZoneId testTimeZone = ZoneId.of(dto.timeZone());
        } catch (Exception e) {
            throw new InvalidTimeZoneException(dto.timeZone() + " är inte en giltig tidszon.");
        }
        House house = new House(
                dto.name(),
                dto.street(),
                dto.streetNumber(),
                dto.zipCode(),
                dto.city(),
                org,
                dto.timeZone()
        );
        for(Long ownerId : dto.ownerIds()){
            User owner = userRepository.findById(ownerId)
                    .orElseThrow(()->new UserNotFoundException("Hittar inte användare med ID " +  dto.ownerIds()+"."));
            house.getOwners().add(owner);
        }
        return house;
    }
}
