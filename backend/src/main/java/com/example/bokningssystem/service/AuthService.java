package com.example.bokningssystem.service;

import com.example.bokningssystem.dtos.*;
import com.example.bokningssystem.entities.Credential;
import com.example.bokningssystem.entities.User;
import com.example.bokningssystem.enums.UserRole;
import com.example.bokningssystem.mapper.UserMapper;
import com.example.bokningssystem.repository.CredentialRepository;
import com.example.bokningssystem.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       JwtService jwtService,
                       CredentialRepository credentialRepository,
                       UserRepository userRepository,
                       UserMapper userMapper,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponseDTO login(LoginDTO dto) {
        // Verifiera lösenord och e-post via Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );

        // Hämta UserDetails och generera JWT
        UserDetails userDetails = userDetailsService.loadUserByUsername(dto.email());
        String token = jwtService.generateToken(userDetails);

        // Hämta Credential (och kopplad User) för att plocka ut roll och ID
        Credential credential = credentialRepository.findByUserEmail(dto.email())
                .orElseThrow(() -> new UsernameNotFoundException("Användare hittades inte"));

        User user = credential.getUser();

        return new AuthResponseDTO(
                token,
                user.getId(),
                user.getEmail(),
                credential.getRole()
        );
    }

    @Transactional
    public UserResponseDTO registerUser(UserRegistrationDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("E-postadressen är redan registrerad");
        }

        User user = userMapper.toEntity(dto);
        User savedUser = userRepository.save(user);

        savePassword(savedUser, dto.password(), dto.confirmPassword());

        return userMapper.toResponseDTO(savedUser);
    }

    @Transactional
    public void savePassword(User user, String password, String confirmPassword) {
        if (password == null || !password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Lösenorden matchar inte");
        }

        // Hasha lösenordet från DTO
        String encodedPassword = passwordEncoder.encode(password);

        // Skapa Credential och koppla den till savedUser
        Credential credential = credentialRepository.findByUser(user)
                .orElseGet(() -> new Credential(user, encodedPassword, UserRole.USER.name()));

        credential.setPassword(encodedPassword);
        credentialRepository.save(credential);
    }

}
