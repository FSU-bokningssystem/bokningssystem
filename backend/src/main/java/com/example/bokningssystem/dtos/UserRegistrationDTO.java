package com.example.bokningssystem.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRegistrationDTO(
        @NotBlank(message = "Du måste ange ditt förnamn")
        String firstName,

        @NotBlank(message = "Du måste ange ditt efternamn")
        String lastName,

        @NotBlank(message = "Du måste ange en mail-adress")
        @Email(message = "Ange en giltig e-postadress")
        String email,

        String phone,

        @NotBlank(message = "Du måste ange din tids-zon")
        String timeZone,

        @NotBlank(message = "Du måste välja ett lösenord")
        String password,

        @NotBlank(message = "Du måste bekräfta ditt lösenord")
        String confirmPassword
) {}
