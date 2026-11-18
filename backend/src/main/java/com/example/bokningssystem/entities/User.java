package com.example.bokningssystem.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.jspecify.annotations.NonNull;

import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Size(max = 100)
    @NotNull
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Size(max = 100)
    @NotNull
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Size(max = 45)
    @Column(name = "phone", length = 45)
    private String phone;

    @Size(max = 64)
    @Column(name = "time_zone", nullable = false, length = 64)
    private String timeZone;

    @OneToMany(mappedBy = "owner")
    private Set<Booking> ownedBookings = new LinkedHashSet<>();

    @NonNull
    @ManyToMany(mappedBy = "participants")
    private Set<Booking> participatingBookings = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Membership> memberships = new LinkedHashSet<>();


    public Long getId() {
        return id;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public Set<Booking> getOwnedBookings() {
        return ownedBookings;
    }

    public void setOwnedBookings(Set<Booking> ownedBookings) {
        this.ownedBookings = ownedBookings;
    }

    public @NonNull Set<Booking> getParticipatingBookings() {
        return participatingBookings;
    }

    public void setParticipatingBookings(@NonNull Set<Booking> participatingBookings) {
        this.participatingBookings = participatingBookings;
    }

    public Set<Membership> getMemberships() {
        return memberships;
    }

    public void setMemberships(Set<Membership> memberships) {
        this.memberships = memberships;
    }

    @Transient
    public boolean isMemberOf(Long organizationId){
        for (Membership membership : memberships){
            if(membership.getOrganization().getId() == organizationId) return true;
        }
        return false;
    }

    public User() {}

    public User(String firstName, String lastName, String email, String phone, String timeZone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.timeZone = timeZone;
    }


    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(firstName, user.firstName) && Objects.equals(lastName, user.lastName) && Objects.equals(email, user.email) && Objects.equals(phone, user.phone);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, email, phone);
    }
}