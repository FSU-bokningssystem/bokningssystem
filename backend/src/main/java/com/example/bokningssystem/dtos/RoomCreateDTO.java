package com.example.bokningssystem.dtos;


public record RoomCreateDTO(String roomNumber, Integer floor, String name, String description, long houseId) {

}
