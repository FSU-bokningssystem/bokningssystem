package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.Credential;
import com.example.bokningssystem.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CredentialRepository extends JpaRepository<Credential, Long> {
    Optional<Credential> findByUser(User user);

    Optional<Credential> findByUserEmail(String email);
}