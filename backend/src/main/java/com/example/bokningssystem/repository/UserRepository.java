package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
