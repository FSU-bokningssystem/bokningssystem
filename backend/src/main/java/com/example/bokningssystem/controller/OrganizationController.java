package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.organizationDtos.OrganizationCreateDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrganizationDetailDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrganizationShortDTO;
import com.example.bokningssystem.service.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(allowCredentials = "true", originPatterns = {"http://localhost:*"})
@RestController
@RequestMapping("/organization")
@Validated
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @PostMapping("/create")
    public ResponseEntity<OrganizationDetailDTO> createOrganization(@Valid @RequestBody OrganizationCreateDTO dto) {
        OrganizationDetailDTO created = organizationService.createOrganization(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<OrganizationShortDTO>> getOrganizationList() {
        return ResponseEntity.ok(organizationService.organizationList());
    }
}