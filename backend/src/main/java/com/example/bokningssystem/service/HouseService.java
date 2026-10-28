package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.HouseShortResponseDTO;
import com.example.bokningssystem.entities.House;
import com.example.bokningssystem.mapper.HouseMapper;
import com.example.bokningssystem.repository.HouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HouseService {
    private final HouseRepository houseRepository;
    private final HouseMapper houseMapper;

    public HouseService(HouseRepository houseRepository, HouseMapper houseMapper) {
        this.houseRepository = houseRepository;
        this.houseMapper = houseMapper;
    }

    public List<HouseShortResponseDTO> findAll() {
        List<House> houseList = houseRepository.findAll();
        List<HouseShortResponseDTO> houseDTOList = houseList
                .stream()
                .map(houseMapper::toHouseShortResponseDTO)
                .toList();
        return houseDTOList;
    }
}
