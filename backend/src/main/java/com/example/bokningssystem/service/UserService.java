package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.UserResponseDTO;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;


    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }


    public List<UserResponseDTO> getAll(){
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }
}