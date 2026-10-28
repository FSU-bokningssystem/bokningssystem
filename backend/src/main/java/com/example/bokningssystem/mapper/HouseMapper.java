package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.HouseShortResponseDTO;
import com.example.bokningssystem.entities.House;
import com.example.bokningssystem.repository.HouseRepository;
import org.springframework.stereotype.Component;

@Component
public class HouseMapper {

    public HouseShortResponseDTO toHouseShortResponseDTO (House house) {
        return new HouseShortResponseDTO(house.getId(), house.getName(), house.getStreet(), house.getStreetNumber(), house.getZipcode(), house.getCity(), house.getOrganization().getName(), house.getTimeZone());
    }
}
