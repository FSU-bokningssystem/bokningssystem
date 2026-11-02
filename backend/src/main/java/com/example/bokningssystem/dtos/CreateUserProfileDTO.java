package com.example.bokningssystem.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateUserProfileDTO {

       @NotBlank(message = "Förnamn krävs")
       private String firstName;

       @NotBlank(message = "Efternamn krävs")
       private String lastName;

       @NotBlank(message = "E-postadress krävs")
       @Email(message = "Ange en giltig e-postadress")
       private String email;

       // Telefon är valfritt
       private String phoneNumber;

       @NotBlank(message = "Lösenord krävs")
       @Size(min = 6, message = "Lösenordet måste vara minst 6 tecken långt")
       private String password;

       @NotBlank(message = "Lösenordsbekräftelse krävs")
       private String confirmPassword;

       private String timeZone;

       public CreateUserProfileDTO() {
       }

       public String getFirstName() {
              return firstName;
       }

       public void setFirstName(String firstName) {
              this.firstName = firstName;
       }

       public String getLastName() {
              return lastName;
       }

       public void setLastName(String lastName) {
              this.lastName = lastName;
       }

       public String getEmail() {
              return email;
       }

       public void setEmail(String email) {
              this.email = email;
       }

       public String getPhoneNumber() {
              return phoneNumber;
       }

       public void setPhoneNumber(String phoneNumber) {
              this.phoneNumber = phoneNumber;
       }

       public String getPassword() {
              return password;
       }

       public void setPassword(String password) {
              this.password = password;
       }

       public String getConfirmPassword() {
              return confirmPassword;
       }

       public void setConfirmPassword(String confirmPassword) {
              this.confirmPassword = confirmPassword;
       }

       public String getTimeZone() {return timeZone;}

       public void setTimeZone(String timeZone) {this.timeZone = timeZone;}
}