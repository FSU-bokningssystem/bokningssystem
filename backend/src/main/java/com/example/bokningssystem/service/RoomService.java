package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.bookingDtos.BookingAvailabilityDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomCreateDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomResponseDTO;
import com.example.bokningssystem.dtos.roomDtos.RoomUpdateDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.House;
import com.example.bokningssystem.entities.Room;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.exceptions.*;
import com.example.bokningssystem.mapper.RoomMapper;
import com.example.bokningssystem.repository.BookingRepository;
import com.example.bokningssystem.repository.HouseRepository;
import com.example.bokningssystem.repository.RoomRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final HouseRepository houseRepository;
    private final RoomMapper roomMapper;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public RoomService(RoomRepository roomRepository, HouseRepository houseRepository, RoomMapper roomMapper, BookingRepository bookingRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.houseRepository = houseRepository;
        this.roomMapper = roomMapper;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public RoomResponseDTO create (RoomCreateDTO roomDTO) {
        return roomMapper.toResponseDTO(roomRepository.save(roomMapper.fromCreateDTO(roomDTO)));
    }

    @Transactional
    public RoomResponseDTO update(Long id, RoomUpdateDTO updateDTO) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Hittar inte lokal med id: " + id));

        roomMapper.updateFromDTO(room, updateDTO);
        return roomMapper.toResponseDTO(roomRepository.saveAndFlush(room));
    }

    @Transactional
    public void delete(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Hittar inte lokal med id: " + id));

        bookingRepository.deleteByRoomId(id);
        roomRepository.delete(room);
    }

    @Transactional(readOnly = true)
    public List<RoomDTO> findAvailableRooms(BookingAvailabilityDTO dto) {
        // Hämta den inloggade användaren från SecurityContext
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedInUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UserNotFoundException("Hittar inte inloggad användare: " + currentUserEmail));

        // Hämta huset och validera att användaren tillhör husets organisation
        House house = houseRepository.findById(dto.houseId())
                .orElseThrow(() -> new HouseNotFoundException("Hittar inte hus med id: " + dto.houseId()));

        if (!loggedInUser.isMemberOf(house.getOrganization().getId())) {
            throw new UserCantBookInHouseException(
                    loggedInUser.getFirstName() + " " + loggedInUser.getLastName()
                            + " har inte rätt att boka tid i " + house.getName()
            );
        }

        ZoneId zone = house.getActualTimeZone();
        List<Room> rooms = roomRepository.findByHouseId(house.getId());

        return rooms.stream()
                .filter(Room::getIsAvailable)
                .filter(room -> isRoomFree(room, dto, zone))
                .map(roomMapper::toDTO)
                .toList();
    }

    private boolean isRoomFree(Room room, BookingAvailabilityDTO dto, ZoneId zone) {
        Instant now = Instant.now();

        // Fall 1: Användaren har angett både start- och sluttid
        if (dto.endTime() != null) {
            if (!dto.endTime().isAfter(dto.startTime())) {
                throw new TimeOrderException("Sluttiden måste vara efter starttiden.");
            }
            Instant start = dto.startTime().atZone(zone).toInstant();
            Instant end = dto.endTime().atZone(zone).toInstant();

            // Om användaren söker bakåt i tiden är rummet inte tillgängligt att boka
            if (end.isBefore(now)) {
                return false;
            }

            return room.getBookings().stream()
                    .noneMatch(booking -> booking.overlapsWith(start, end));
        }

        // Fall 2: Användaren har bara valt ett datum (endTime == null)
        // Kontrollerar om det finns minst en ledig lucka någon gång under det sökta dygnet
        LocalDate date = dto.startTime().toLocalDate();
        Instant dayStart = date.atStartOfDay(zone).toInstant();
        Instant dayEnd = date.plusDays(1).atStartOfDay(zone).toInstant();

        // Om hela det valda dygnet redan har passerat
        if (!dayEnd.isAfter(now)) {
            return false;
        }

        // Starta markören vid nuvarande tidpunkt om sökningen gäller idag, annars vid dygnets start
        Instant searchStart = dayStart.isBefore(now) ? now : dayStart;

        // Hämta och sortera dagens bokningar på starttid
        List<Booking> bookingsThatDay = room.getBookings().stream()
                .filter(booking -> booking.overlapsWith(searchStart, dayEnd))
                .sorted(Comparator.comparing(Booking::getStartTime))
                .toList();

        Instant cursor = searchStart;
        for (Booking booking : bookingsThatDay) {
            // Om nästa bokning börjar efter vår nuvarande tidpunkt finns en ledig lucka
            if (booking.getStartTime().isAfter(cursor)) {
                return true;
            }
            // Annars flyttar vi fram markören till när denna bokning slutar
            if (booking.getEndTime().isAfter(cursor)) {
                cursor = booking.getEndTime();
            }
        }

        // Om det finns tid kvar mellan sista bokningen och dygnets slut
        return cursor.isBefore(dayEnd);
    }
}
