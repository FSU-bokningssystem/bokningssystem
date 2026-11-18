package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.houseDtos.HouseDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrganizationDetailDTO;
import com.example.bokningssystem.dtos.UserShortResponseDTO;
import com.example.bokningssystem.entities.Organization;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrganizationMapper {

    private final HouseMapper houseMapper;
    private final UserMapper userMapper;

    public OrganizationMapper(HouseMapper houseMapper, UserMapper userMapper) {
        this.houseMapper = houseMapper;
        this.userMapper = userMapper;
    }

    public OrganizationDetailDTO toDetailDTO(Organization organization) {
        if (organization == null) return null;

        List<HouseDTO> houseDTOs = organization.getHouses().stream()
                .map(houseMapper::toHouseDTO)
                .toList();
        List<UserShortResponseDTO> members = organization.getMembers().stream()
                .map(userMapper::userShortResponseDTO)
                .toList();

        return new OrganizationDetailDTO(organization.getId(), organization.getName(), houseDTOs, members);
    }
}
