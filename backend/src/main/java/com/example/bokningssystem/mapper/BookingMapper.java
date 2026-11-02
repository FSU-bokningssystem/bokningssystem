package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.BookingRequestDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Room;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.exceptions.*;
import com.example.bokningssystem.repository.RoomRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class BookingMapper {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingMapper(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    public Booking fromBookingRequestDTO (BookingRequestDTO DTO) {
        Room room = roomRepository.findByRoomNumberIgnoreCaseAndHouseId(DTO.roomNumber(),DTO.houseId())
                .orElseThrow(()->new RoomInHouseNotFoundException("Hittade inte rum "+DTO.roomNumber()+" i hus " + DTO.houseId()+"."));
        // Beräkna bokningens varaktighet utifrån skillnaden mellan start- och sluttid och ge felmeddelande om de är i fel ordning.
        int duration = (int) ChronoUnit.MINUTES.between(DTO.startTime(), DTO.endTime());
        if(duration<0) throw new TimeOrderException("Sluttiden måste vara efter starttiden.");

        //Konvertera DTO:ns starttid till en Instant med hjälp av husets tidszon.
        Instant startTime = DTO.startTime().atZone(room.getHouse().getActualTimeZone()).toInstant();

        User owner = userRepository.findById(DTO.ownerId())
                .orElseThrow(()->new UserNotFoundException("Hittar inte användare med ID " +  DTO.ownerId()+"."));
        return new Booking(
                DTO.title(),
                DTO.description(),
                startTime,
                room,
                duration,
                owner);
    }
}
