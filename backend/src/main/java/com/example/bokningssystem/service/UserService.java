package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.CreateUserProfileDTO;
import com.example.bokningssystem.dtos.UserResponseDTO;
import com.example.bokningssystem.entities.Credential;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.repository.CredentialRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CredentialRepository credentialRepository;

    public UserService(UserRepository userRepository, CredentialRepository credentialRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.userMapper = userMapper;
    }

    public List<UserResponseDTO> getAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Användare hittades inte med id: " + id));
    }

    @Transactional
    public UserResponseDTO createUserProfile(CreateUserProfileDTO dto) {
        if (dto.getPassword() == null || !dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("Lösenorden matchar inte");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("E-postadressen är redan registrerad");
        }

        User user = userMapper.toEntity(dto);
        User savedUser = userRepository.save(user);

        Credential credential = new Credential(savedUser, dto.getPassword(), "USER");
        credentialRepository.save(credential);

        return userMapper.toResponseDTO(savedUser);
    }

    @Transactional
    public UserResponseDTO editUserProfile(Long id, CreateUserProfileDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Användare hittades inte med id: " + id));

        // Om e-posten ändrats, validera att den inte används av någon annan
        if (!user.getEmail().equalsIgnoreCase(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("E-postadressen är redan registrerad");
        }

        // Uppdatera lösenordet ENDAST om användaren har fyllt i ett nytt lösenord
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            if (!dto.getPassword().equals(dto.getConfirmPassword())) {
                throw new IllegalArgumentException("Lösenorden matchar inte");
            }

            Credential credential = credentialRepository.findByUser(user)
                    .orElseGet(() -> new Credential(user, dto.getPassword(), "USER"));
            credential.setPassword(dto.getPassword());
            credentialRepository.save(credential);
        }

        // Mappa användaruppgifter
        userMapper.updateEntityFromDto(user, dto);

        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }
}