package com.example.bokningssystem.mapper;

import com.example.bokningssystem.dtos.BookingShortResponseDTO;
import com.example.bokningssystem.entities.Booking;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BookingMapper {
    private final RoomMapper roomMapper;
    private final UserMapper userMapper;


    public BookingMapper(RoomMapper roomMapper, UserMapper userMapper) {
        this.roomMapper = roomMapper;
        this.userMapper = userMapper;
    }

    public BookingShortResponseDTO toBookingShortResponseDTO (Booking booking){
        return new BookingShortResponseDTO(
                booking.getId(),
                booking.getTitle(),
                booking.getDescription(),
                booking.getStartTime(),
                roomMapper.toResponseDTO(booking.getRoom()),
                booking.getDuration(),
                userMapper.toResponseDTO(booking.getOwner()),
                booking.getUsers().stream()
                        .map(userMapper::toResponseDTO)
                        .collect(Collectors.toSet()));
    }
}
