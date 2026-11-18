package com.example.bokningssystem.service;

import com.example.bokningssystem.entities.Credential;
import com.example.bokningssystem.repository.CredentialRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/** Kopplar samman vår databasmodell User/Credential med Spring Securitys autentiseringsmekanism */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CredentialRepository credentialRepository;

    public CustomUserDetailsService(CredentialRepository credentialRepository) {
        this.credentialRepository = credentialRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Credential credential = credentialRepository.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Användare hittades inte med epost: " + email));

        String roleName = credential.getRole();
        // Säkerställer att rollnamnet börjar med "ROLE_",
        // så att @PreAuthorize("hasrole('ADMIN')") kan användas i våra controllers
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        return new org.springframework.security.core.userdetails.User(
                credential.getUser().getEmail(),
                credential.getPassword(),
                List.of(new SimpleGrantedAuthority(roleName))
        );
    }
}
