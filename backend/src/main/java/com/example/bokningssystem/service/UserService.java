package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.UserResponseDTO;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.dtos.CreateUserProfileDTO;
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
    private final UserMapper userMapper;


    public UserService(UserRepository userRepository, UserMapper userMapper) {
    public UserService(UserRepository userRepository, CredentialRepository credentialRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.credentialRepository = credentialRepository;
        this.userMapper = userMapper;
    }


    public List<UserResponseDTO> getAll(){
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponseDTO)
                .toList();
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Användare hittades inte med id: " + id));
    }

    @Transactional
    public User createUserProfile(CreateUserProfileDTO dto) {
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

        return savedUser;
    }
}