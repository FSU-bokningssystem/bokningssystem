package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.houseDtos.HouseCreationDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseShortResponseDTO;
import com.example.bokningssystem.dtos.houseDtos.HouseWithRoomsResponseDTO;
import com.example.bokningssystem.entities.House;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.exceptions.ForbiddenException;
import com.example.bokningssystem.exceptions.HouseNotFoundException;
import com.example.bokningssystem.exceptions.MembershipNotFoundException;
import com.example.bokningssystem.mapper.HouseMapper;
import com.example.bokningssystem.repository.HouseRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HouseService {
    private final HouseRepository houseRepository;
    private final HouseMapper houseMapper;
    private final AuthService authService;
    private final UserService userService;

    public HouseService(HouseRepository houseRepository,
                        HouseMapper houseMapper,
                        AuthService authService,
                        UserService userService) {
        this.houseRepository = houseRepository;
        this.houseMapper = houseMapper;
        this.authService = authService;
        this.userService = userService;
    }

    public List<HouseShortResponseDTO> findAll() {
        return houseRepository.findAll()
                .stream()
                .map(houseMapper::toHouseShortResponseDTO)
                .toList();
    }

    public HouseWithRoomsResponseDTO findHouse(long id) {
        House house = houseRepository.findById(id)
                .orElseThrow(() -> new HouseNotFoundException("Hus med id: "+id+" hittades inte."));
        return houseMapper.toHouseWithRoomsResponseDTO(house);
    }

    public HouseDTO create (HouseCreationDTO dto, UserDetails auth){
        User loggedInUser = userService.getUserFromAuth(auth);
        House house = houseMapper.fromCreationDTO(dto);
        if(!(loggedInUser.isAdminOrOwnerOf(dto.organizationId()) || authService.hasRole(auth, "ADMIN")))
            throw new ForbiddenException("Endast systemadmin, organisationsadmin, eller organisationsägare får skapa nya hus.");
        for(User owner : house.getOwners()){
            if(!owner.isMemberOf(house.getOrganization().getId()))
                throw new MembershipNotFoundException(owner.getFirstName() + " " + owner.getLastName() + " är inte medlem i " + house.getOrganization().getName() + ".");
        }
        House newHouse = houseRepository.save(house);
        return houseMapper.toHouseDTO(newHouse);
    }
}
