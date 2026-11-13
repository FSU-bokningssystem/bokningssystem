package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.BookingRequestDTO;
import com.example.bokningssystem.dtos.BookingResponseDTO;
import com.example.bokningssystem.dtos.booking.BookingChangeDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Room;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.exceptions.*;
import com.example.bokningssystem.mapper.BookingMapper;
import com.example.bokningssystem.repository.BookingRepository;
import com.example.bokningssystem.repository.HouseRepository;
import com.example.bokningssystem.repository.RoomRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingMapper bookingMapper,
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository
    ) {
        this.bookingMapper = bookingMapper;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    public BookingResponseDTO create(BookingRequestDTO requestDTO){
        Booking newBooking = bookingMapper.fromBookingRequestDTO(requestDTO);
        if(!newBooking.getRoom().getIsAvailable()) throw new RoomNotAvailableException(
                "Rum " + requestDTO.roomNumber() + " går inte att boka.");
        List<Booking> futureBookings = newBooking.getRoom().getBookings()
                .stream()
                .filter(booking->booking.getEndTime().isAfter(Instant.now()))
                .toList();
        for(Booking futureBooking: futureBookings) {
            if(futureBooking.overlapsWith(newBooking.getStartTime(), newBooking.getEndTime())) {
                LocalDateTime start = LocalDateTime.ofInstant(futureBooking.getStartTime(), futureBooking.getRoom().getHouse().getActualTimeZone());
                LocalDateTime end =  LocalDateTime.ofInstant(futureBooking.getEndTime(), futureBooking.getRoom().getHouse().getActualTimeZone());
                throw new RoomOccupiedException(
                        "Rum " + requestDTO.roomNumber() + " är bokat " + start + " till " + end + ".");
            }
        }
        return bookingMapper.toBookingResponseDTO(bookingRepository.save(newBooking));
    }

    public BookingResponseDTO change(BookingChangeDTO dto) {
        Booking oldBooking = bookingRepository.findById(dto.id())
                .orElseThrow(() -> new BookingNotFoundException("Hittade inte bokning " + dto.id() + "."));
        // Om DTO:n innehåller en beskrivning, uppdatera beskrivningen.
        if (dto.description() != null) oldBooking.setDescription(dto.description());
        // Om DTO:n innehåller ett rumsnummer, kontrollera om rumsnumret finns, är tillgängligt, och tillhör ett hus i samma organisation. I så fall, uppdatera rummet. Annars kasta fel.
        if ((dto.roomNumber() != null)) {
            Room newRoom = roomRepository.findByRoomNumberIgnoreCase(dto.roomNumber())
                    .orElseThrow(() -> new RoomNotFoundException("Hittade inte rum " + dto.roomNumber() +"."));
            if(newRoom.getHouse().getOrganization().getId()!=oldBooking.getRoom().getHouse().getOrganization().getId()) {
                throw new CantMoveBookingOutsideOrganizationException("Du får inte flytta bokningen utanför organisationen.");
            }
            if(!newRoom.getIsAvailable()) throw new RoomNotAvailableException("Rum " + dto.roomNumber() + " går inte att boka.");
            oldBooking.setRoom(newRoom);
        }
        //Om DTO:n innehåller en titel, uppdatera titeln.
        if (dto.title() != null) oldBooking.setTitle(dto.title());
        // Om DTO:n har ett ägarId, kontrollera om ägaren finns och är medlem av rätt organisation, och uppdatera i så fall ägaren.
        if (dto.ownerId() != null) {
            User newOwner = userRepository.findById(dto.ownerId())
                    .orElseThrow(()->new UserNotFoundException("Användare med ID " + dto.ownerId() + "hittades ej."));
            if(!newOwner.isMemberOf(oldBooking.getRoom().getHouse().getOrganization().getId()))
                throw new CantReassignBookingOutsideOrganization("Användare " + dto.ownerId() + " är inte en del av samma organisation.");
            oldBooking.setOwner(newOwner);
        }
        // Om DTO:n har en start-tid, tolka på följande sätt:
        // Sluttid saknas: Ändra start-tid till ny starttid, behåll samma längd på mötet (så kl 10-11 ändras till 12-13).
        // Sluttid finns: Ändra både starttid och längd.
        if(dto.startTime() != null) {

        }
        //Om starttid saknas men det finns en sluttid, ändra mötets längd.
        if(dto.startTime() == null && dto.endTime() != null) {

        }
        // Kontrollera att den ändrade bokningen inte överlappar med andra bokningar.

        Booking newBooking = bookingRepository.save(oldBooking);
        return bookingMapper.toBookingResponseDTO(newBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> findAll() {
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toBookingResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> findByRoomId(Long roomId) {
        return bookingRepository.findByRoomId(roomId)
                .stream()
                .map(bookingMapper::toBookingResponseDTO)
                .toList();
    }
}
