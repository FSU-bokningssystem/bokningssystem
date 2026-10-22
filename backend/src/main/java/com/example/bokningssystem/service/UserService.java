package com.example.bokningssystem.service;

import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {
    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public List<User> getAll(){
        return userRepository.findAll();
    }
}