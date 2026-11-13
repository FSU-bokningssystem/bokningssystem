package com.example.bokningssystem.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
        @NotBlank(message = "Du måste ange en e-postadress")
        @Email(message = "Ange en giltig e-postadress")
        String email,

        @NotBlank(message = "Du måste ange ett lösenord")
        String password
) {}
