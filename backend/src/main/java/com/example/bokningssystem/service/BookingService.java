package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.bookingDtos.BookingChangeDTO;
import com.example.bokningssystem.dtos.bookingDtos.BookingRequestDTO;
import com.example.bokningssystem.dtos.bookingDtos.BookingResponseDTO;
import com.example.bokningssystem.dtos.bookingDtos.UserOrgBookingsDTO;
import com.example.bokningssystem.entities.Booking;
import com.example.bokningssystem.entities.Room;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.exceptions.*;
import com.example.bokningssystem.mapper.BookingMapper;
import com.example.bokningssystem.repository.BookingRepository;
import com.example.bokningssystem.repository.MembershipRepository;
import com.example.bokningssystem.repository.RoomRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.LinkedHashSet;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
public class BookingService {
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final UserContextService userContextService;

    public BookingService(
            BookingMapper bookingMapper,
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            MembershipRepository membershipRepository,
            UserContextService userContextService) {
        this.bookingMapper = bookingMapper;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.userContextService = userContextService;
    }

    @Transactional
    public BookingResponseDTO create(BookingRequestDTO requestDTO) {
        User loggedInUser = userContextService.getCurrentUser();
        Booking newBooking = bookingMapper.fromBookingRequestDTO(requestDTO, loggedInUser);

        Long orgId = newBooking.getRoom().getHouse().getOrganization().getId();
        userContextService.requireMembership(orgId);

        if (!newBooking.getRoom().getIsAvailable()) {
            throw new RoomNotAvailableException("Rum " + requestDTO.roomNumber() + " går inte att boka.");
        }

        List<Booking> futureBookings = newBooking.getRoom().getBookings()
                .stream()
                .filter(booking -> booking.getEndTime().isAfter(Instant.now()))
                .toList();

        for (Booking futureBooking : futureBookings) {
            if (futureBooking.overlapsWith(newBooking.getStartTime(), newBooking.getEndTime())) {
                LocalDateTime start = LocalDateTime.ofInstant(futureBooking.getStartTime(), futureBooking.getRoom().getHouse().getActualTimeZone());
                LocalDateTime end = LocalDateTime.ofInstant(futureBooking.getEndTime(), futureBooking.getRoom().getHouse().getActualTimeZone());
                throw new RoomOccupiedException(
                        "Rum " + requestDTO.roomNumber() + " är bokat " + start + " till " + end + ".");
            }
        }
        addParticipantsToNewBooking(newBooking, requestDTO.participantIds());

        return bookingMapper.toBookingResponseDTO(bookingRepository.save(newBooking));
    }

    @Transactional
    public BookingResponseDTO change(BookingChangeDTO dto) {
        Booking oldBooking = bookingRepository.findById(dto.id())
                .orElseThrow(() -> new BookingNotFoundException("Hittade inte bokning " + dto.id() + "."));

        userContextService.requireBookingModifyAccess(oldBooking);

        Long tempHouseId = oldBooking.getRoom().getHouse().getId();
        if (dto.houseId() != null) tempHouseId = dto.houseId();

        if (dto.roomNumber() != null) {
            final String possibleErrorMsg = "Hittade inte rum " + dto.roomNumber() + " i hus " + tempHouseId + ".";
            Room newRoom = roomRepository.findByRoomNumberIgnoreCaseAndHouseId(dto.roomNumber(), tempHouseId)
                    .orElseThrow(() -> new RoomInHouseNotFoundException(possibleErrorMsg));

            if (!Objects.equals(newRoom.getHouse().getOrganization().getId(), oldBooking.getRoom().getHouse().getOrganization().getId())) {
                throw new CantMoveBookingOutsideOrganizationException("Du får inte flytta bokningen utanför organisationen.");
            }
            if (!newRoom.getIsAvailable()) {
                throw new RoomNotAvailableException("Rum " + dto.roomNumber() + " går inte att boka.");
            }
            oldBooking.setRoom(newRoom);
        }

        if (dto.ownerId() != null) {
            User newOwner = userRepository.findById(dto.ownerId())
                    .orElseThrow(() -> new UserNotFoundException("Användare med ID " + dto.ownerId() + " hittades ej."));
            if (!newOwner.isMemberOf(oldBooking.getRoom().getHouse().getOrganization().getId())) {
                throw new CantReassignBookingOutsideOrganization("Användare " + dto.ownerId() + " är inte en del av samma organisation.");
            }
            oldBooking.getParticipants().removeIf(u -> Objects.equals(u.getId(), newOwner.getId()));
            oldBooking.setOwner(newOwner);
        }

        if (dto.startTime() != null) {
            oldBooking.setStartTime(dto.startTime().atZone(oldBooking.getRoom().getHouse().getActualTimeZone()).toInstant());
            if (dto.endTime() != null) {
                oldBooking.setDuration((int) ChronoUnit.MINUTES.between(dto.startTime(), dto.endTime()));
            }
        }

        if (dto.startTime() == null && dto.endTime() != null) {
            oldBooking.setDuration((int) ChronoUnit.MINUTES.between(
                    oldBooking.getStartTime(),
                    dto.endTime().atZone(oldBooking.getRoom().getHouse().getActualTimeZone()).toInstant()
            ));
        }

        if (oldBooking.getDuration() < 0) {
            throw new TimeOrderException("Sluttiden måste vara efter starttiden.");
        }

        List<Booking> futureBookings = oldBooking.getRoom().getBookings()
                .stream()
                .filter(booking -> booking.getEndTime().isAfter(Instant.now()))
                .toList();

        for (Booking futureBooking : futureBookings) {
            if (!Objects.equals(futureBooking.getId(), oldBooking.getId())) {
                if (futureBooking.overlapsWith(oldBooking.getStartTime(), oldBooking.getEndTime())) {
                    LocalDateTime start = LocalDateTime.ofInstant(futureBooking.getStartTime(), futureBooking.getRoom().getHouse().getActualTimeZone());
                    LocalDateTime end = LocalDateTime.ofInstant(futureBooking.getEndTime(), futureBooking.getRoom().getHouse().getActualTimeZone());
                    throw new RoomOccupiedException(
                            "Rum " + oldBooking.getRoom().getRoomNumber() + " är bokat " + start + " till " + end + ".");
                }
            }
        }

        if (dto.description() != null) oldBooking.setDescription(dto.description());
        if (dto.title() != null) oldBooking.setTitle(dto.title());

        return bookingMapper.toBookingResponseDTO(bookingRepository.save(oldBooking));
    }

    @Transactional
    public BookingResponseDTO transferOwner(long bookingId, long newOwnerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Hittar inte bokning " + bookingId));

        userContextService.requireBookingModifyAccess(booking);

        long orgId = booking.getRoom().getHouse().getOrganization().getId();

        membershipRepository.findByUserIdAndOrganizationId(newOwnerId, orgId)
                .orElseThrow(() -> new MembershipNotFoundException(
                        "Användare " + newOwnerId + " är inte medlem i organisationen"));

        User newOwner = userRepository.findById(newOwnerId)
                .orElseThrow(() -> new UserNotFoundException("Hittar inte användare " + newOwnerId));

        booking.getParticipants().removeIf(u -> Objects.equals(u.getId(), newOwnerId));
        booking.setOwner(newOwner);
        return bookingMapper.toBookingResponseDTO(booking);
    }

    @Transactional
    public void delete(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Hittade inte bokning " + id + "."));

        userContextService.requireBookingModifyAccess(booking);

        bookingRepository.delete(booking);
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
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomInHouseNotFoundException("Hittade inte rum " + roomId + "."));
        userContextService.requireMembership(room.getHouse().getOrganization().getId());

        return bookingRepository.findByRoomId(roomId)
                .stream()
                .map(bookingMapper::toBookingResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserOrgBookingsDTO findUserBookingsInOrganization(long userId, long orgId) {
        userContextService.requireMembership(orgId);
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
                .forEach(b -> b.getParticipants().removeIf(u -> Objects.equals(u.getId(), userId)));
    }

    @Transactional
    public BookingResponseDTO addParticipant(Long bookingId, Long userId) {
        Booking booking = getBookingOwnedByCurrentUser(bookingId);

        if (Objects.equals(booking.getOwner().getId(), userId)) {
            throw new IllegalArgumentException("Bokningsägaren kan inte läggas till som deltagare i sin egen bokning");
        }

        Long orgId = booking.getRoom().getHouse().getOrganization().getId();

        membershipRepository.findByUserIdAndOrganizationId(userId, orgId)
                .orElseThrow(() -> new MembershipNotFoundException(
                        "Användare " + userId + " är inte medlem i organisationen.")
                );

        User participant = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Hittar inte användare " + userId + "."));

        booking.getParticipants().add(participant);
        return bookingMapper.toBookingResponseDTO(booking);
    }

    @Transactional
    public BookingResponseDTO removeParticipant(Long bookingId, Long userId) {
        Booking booking = getBookingOwnedByCurrentUser(bookingId);

        boolean removed = booking.getParticipants().removeIf(u -> Objects.equals(u.getId(), userId));
        if (!removed) {
            throw new UserNotFoundException("Användare " + userId + " är inte deltagare i denna bokning.");
        }

        return bookingMapper.toBookingResponseDTO(booking);
    }

    private Booking getBookingOwnedByCurrentUser(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Hittade inte bokning " + bookingId + "."));

        User currentUser = userContextService.getCurrentUser();
        if (!Objects.equals(booking.getOwner().getId(), currentUser.getId())) {
            throw new ForbiddenException("Endast bokningsägaren får hantera deltagare för denna bokning.");
        }

        if (booking.getEndTime().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Det går inte att ändra deltagare på en bokning som redan har passerat");
        }

        return booking;
    }

    private void addParticipantsToNewBooking(Booking booking, List<Long> participantIds) {
        if (participantIds == null || participantIds.isEmpty()) return;

        Long orgId = booking.getRoom().getHouse().getOrganization().getId();
        Long ownerId = booking.getOwner().getId();

        for (Long userId : new LinkedHashSet<>(participantIds)) { // tar bort dubbletter
            if (userId.equals(ownerId)) {
                throw new IllegalArgumentException(
                        "Bokningsägaren kan inte läggas till som deltagare i sin egen bokning");
            }

            membershipRepository.findByUserIdAndOrganizationId(userId, orgId)
                    .orElseThrow(() -> new MembershipNotFoundException(
                            "Användare " + userId + " är inte medlem i organisationen."));

            User participant = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(
                            "Hittar inte användare " + userId + "."));

            booking.getParticipants().add(participant);
        }
    }

}
