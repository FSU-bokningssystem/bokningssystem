package com.example.bokningssystem.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "credentials")
public class Credential {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 72)
    private String password;

    @Column(length = 45)
    private String role;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    public Credential() {
    }

    public Credential(User user, String password, String role) {
        this.user = user;
        this.password = password;
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}