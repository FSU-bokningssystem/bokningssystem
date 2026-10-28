package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.House;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseRepository extends JpaRepository<House, Long> {
}
