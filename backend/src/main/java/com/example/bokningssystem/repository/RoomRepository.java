package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumberIgnoreCaseAndHouseId(String roomNumber, long houseId);

}
