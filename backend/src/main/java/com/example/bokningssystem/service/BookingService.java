package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.BookingRequestDTO;
import com.example.bokningssystem.dtos.BookingResponseDTO;
import com.example.bokningssystem.dtos.UserOrgBookingsDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.exceptions.*;
import com.example.bokningssystem.mapper.BookingMapper;
import com.example.bokningssystem.repository.BookingRepository;
import com.example.bokningssystem.repository.MembershipRepository;
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
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;


    public BookingService(BookingMapper bookingMapper, BookingRepository bookingRepository, MembershipRepository membershipRepository, UserRepository userRepository) {
        this.bookingMapper = bookingMapper;
        this.bookingRepository = bookingRepository;
        this.membershipRepository = membershipRepository;
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

    @Transactional(readOnly = true)
    public UserOrgBookingsDTO findUserBookingsInOrganization(long userId, long orgId) {
        Instant now = Instant.now();
        return new UserOrgBookingsDTO(
                ownedFutureBookings(userId, orgId, now).stream().map(bookingMapper::toBookingResponseDTO).toList(),
                bookingRepository.findByParticipantsIdAndRoomHouseOrganizationIdAndStartTimeAfter(userId, orgId, now)
                        .stream().map(bookingMapper::toBookingResponseDTO).toList());
    }

    public List<Booking> ownedFutureBookings(long userId, long orgId, Instant now) {
        return bookingRepository.findByOwnerIdAndRoomHouseOrganizationIdAndStartTimeAfter(userId, orgId, now);
    }

    @Transactional
    public void removeUserFromFutureBookings(long userId, long orgId) {
        bookingRepository.findByParticipantsIdAndRoomHouseOrganizationIdAndStartTimeAfter(userId, orgId, Instant.now())
                .forEach(b -> b.getParticipants().removeIf(u -> u.getId().equals(userId)));
    }

    @Transactional
    public BookingResponseDTO transferOwner(long bookingId, long newOwnerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Hittar inte bokning " + bookingId));
        long orgId = booking.getRoom().getHouse().getOrganization().getId();

        // Validering: den nya ägaren måste vara medlem i samma organisation
        membershipRepository.findByUserIdAndOrganizationId(newOwnerId, orgId)
                .orElseThrow(() -> new MembershipNotFoundException(
                        "Användare " + newOwnerId + " är inte medlem i organisationen"));

        User newOwner = userRepository.findById(newOwnerId)
                .orElseThrow(() -> new UserNotFoundException("Hittar inte användare " + newOwnerId));

        booking.getParticipants().removeIf(u -> u.getId().equals(newOwnerId)); // ingen ska vara både ägare och deltagare
        booking.setOwner(newOwner);
        return bookingMapper.toBookingResponseDTO(booking);
    }
}
