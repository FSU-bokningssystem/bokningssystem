package com.example.bokningssystem.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;

import java.util.Objects;

@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 10)
    @Column(name = "room_number", length = 10)
    private String roomNumber;

    @Column(name = "floor")
    private Integer floor;

    @Size(max = 45)
    @NotNull
    @Column(name = "name", nullable = false, length = 45)
    private String name;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "house_id", nullable = false)
    private House house;

    @NotNull
    @ColumnDefault("true")
    @Column(name = "is_available", nullable = false, columnDefinition = "TINYINT", length=1)
    private boolean isAvailable;

    public Room() {
    }

    public Room(String roomNumber, Integer floor, String name, String description, House house) {
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.name = name;
        this.description = description;
        this.house = house;
        this.isAvailable=true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public House getHouse() {
        return house;
    }

    public void setHouse(House house) {
        this.house = house;
    }

    public boolean getAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable ;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Room room = (Room) o;
        return Objects.equals(getRoomNumber(), room.getRoomNumber()) && Objects.equals(getFloor(), room.getFloor()) && Objects.equals(getHouse(), room.getHouse());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getRoomNumber(), getFloor(), getHouse());
    }
}