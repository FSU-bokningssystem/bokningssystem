package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.Credential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CredentialRepository extends JpaRepository<Credential, Long> {
}