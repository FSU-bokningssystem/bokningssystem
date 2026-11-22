package com.example.bokningssystem.service;


import com.example.bokningssystem.dtos.userDtos.UserRegistrationDTO;
import com.example.bokningssystem.dtos.userDtos.UserResponseDTO;
import com.example.bokningssystem.dtos.userDtos.UserWithBookingsResponseDTO;
import com.example.bokningssystem.exceptions.UserNotFoundException;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.mapper.UserWithBookingsMapper;
import com.example.bokningssystem.repository.CredentialRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserWithBookingsMapper userWithBookingsMapper;
    private final AuthService authService;
    private final CredentialRepository credentialRepository;

    public UserService(UserRepository userRepository, UserMapper userMapper, UserWithBookingsMapper userWithBookingsMapper, AuthService authService, CredentialRepository credentialRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.userWithBookingsMapper = userWithBookingsMapper;
        this.authService = authService;
        this.credentialRepository = credentialRepository;
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

    @Transactional
    public void anonymizeUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new UserNotFoundException("Hittar inte användare " + userId));
        user.setFirstName("Borttagen");
        user.setLastName("Användare");
        user.setEmail("borttagen"+ userId + "@anvandare.invalid");
        user.setPhone(null);

        credentialRepository.findByUser(user).ifPresent(credentialRepository::delete);
        userRepository.save(user);
    }



    public User getUserFromAuth (UserDetails auth) {
        return userRepository.findByEmail(auth.getUsername())
                .orElseThrow(() -> new UserNotFoundException("Hittar inte användare med e-post " + auth.getUsername()+"."));
    }
}