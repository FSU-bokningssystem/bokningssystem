package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.HouseDTO;
import com.example.bokningssystem.dtos.OrganizationDetailDTO;
import com.example.bokningssystem.entities.Organization;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrganizationMapper {

    private final HouseMapper houseMapper;

    public OrganizationMapper(HouseMapper houseMapper) {
        this.houseMapper = houseMapper;
    }

    public OrganizationDetailDTO toDetailDTO(Organization organization) {
        if (organization == null) return null;

        List<HouseDTO> houseDTOs = organization.getHouses().stream()
                .map(houseMapper::toHouseDTO)
                .toList();

        return new OrganizationDetailDTO(organization.getId(), organization.getName(), houseDTOs);
    }
}
