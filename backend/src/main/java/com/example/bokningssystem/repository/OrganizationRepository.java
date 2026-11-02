package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
