package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.enums.UserRole;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.entities.Credential;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.mapper.UserWithBookingsMapper;
import com.example.bokningssystem.repository.CredentialRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserWithBookingsMapper userWithBookingsMapper;
    private final CredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, CredentialRepository credentialRepository, UserMapper userMapper, UserWithBookingsMapper userWithBookingsMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.userMapper = userMapper;
        this.userWithBookingsMapper = userWithBookingsMapper;
        this.passwordEncoder = passwordEncoder;
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

    @Transactional
    public UserResponseDTO registerUser(UserRegistrationDTO dto) {
        if (dto.password() == null || !dto.password().equals(dto.confirmPassword())) {
            throw new IllegalArgumentException("Lösenorden matchar inte");
        }

        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("E-postadressen är redan registrerad");
        }

        User user = userMapper.toEntity(dto);
        User savedUser = userRepository.save(user);

        // Hasha lösenordet från DTO
        String encodedPassword = passwordEncoder.encode(dto.password());

        // Skapa Credential och koppla den till savedUser
        Credential credential = new Credential(
                savedUser,
                encodedPassword,
                UserRole.USER.name()
        );

        credentialRepository.save(credential);

        return userMapper.toResponseDTO(savedUser);
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
            if (!dto.password().equals(dto.confirmPassword())) {
                throw new IllegalArgumentException("Lösenorden matchar inte");
            }

            // Hasha det nya lösenordet
            String encodedPassword = passwordEncoder.encode(dto.password());

            Credential credential = credentialRepository.findByUser(user)
                    .orElseGet(() -> new Credential(user, encodedPassword, UserRole.USER.name()));

            credential.setPassword(encodedPassword);
            credentialRepository.save(credential);
        }

        // Mappa användaruppgifter
        userMapper.updateEntityFromDto(user, dto);

        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }
}