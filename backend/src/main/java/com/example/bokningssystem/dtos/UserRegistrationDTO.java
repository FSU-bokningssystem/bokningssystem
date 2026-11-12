package com.example.bokningssystem.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record UserRegistrationDTO(
        @NotNull (message = "Du måste uppge ditt förnamn")
        String firstName,

        @NotNull (message = "Du måste uppge ditt efternamn")
        String lastName,

        @NotNull (message = "Du måste uppe en mail-adress")
        @Email (message = "Ange en giltig e-postadress")
        String email,

        String phone,

        @NotNull (message = "Du måste uppge din tids-zon")
        String timeZone,

        @NotNull(message = "Du måste välja ett lösenord")
        String password,

        String confirmPassword
) {}
