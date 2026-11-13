package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.mapper.UserWithBookingsMapper;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserWithBookingsMapper userWithBookingsMapper;
    private final AuthService authService;

    public UserService(UserRepository userRepository, UserMapper userMapper, UserWithBookingsMapper userWithBookingsMapper, AuthService authService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.userWithBookingsMapper = userWithBookingsMapper;
        this.authService = authService;
    }

    public List<UserResponseDTO> getAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }

    public UserResponseDTO getUserById(Long id) {
        return userMapper.toResponseDTO(userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Användare hittades inte med id: " + id)));
    }

    public UserWithBookingsResponseDTO getUserWithBookings(Long id) {
        return userWithBookingsMapper.toUserWithBookingsResponseDTO(userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Användare hittades inte med id: " + id)));
    }

    @Transactional
    public UserResponseDTO editUserProfile(Long id, UserRegistrationDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Användare hittades inte med id: " + id));

        // Om e-posten ändrats, validera att den inte används av någon annan
        if (!user.getEmail().equalsIgnoreCase(dto.email()) && userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("E-postadressen är redan registrerad");
        }

        // Uppdatera lösenordet ENDAST om användaren har fyllt i ett nytt lösenord
        if (dto.password() != null && !dto.password().isBlank()) {
            authService.savePassword(user, dto.password(), dto.confirmPassword());
        }

        // Mappa användaruppgifter
        userMapper.updateEntityFromDto(user, dto);

        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }
}