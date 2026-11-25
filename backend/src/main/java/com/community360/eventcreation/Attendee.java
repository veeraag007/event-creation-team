// Defines the PostgreSQL attendee account table and keeps password hashes server-side.
package com.community360.eventcreation;

import jakarta.persistence.*;

@org.hibernate.annotations.DynamicUpdate
@Entity
@Table(name = "attendees")
public class Attendee {
    @Id
    private String id;
    @Column(nullable = false, length = 100)
    private String fullName;
    @Column(nullable = false, unique = true, length = 254)
    private String email;
    @Column(nullable = false)
    private String passwordHash;
    @Column(length = 30)
    private String phone;
    private Boolean emailVerified;

    @Column(length = 100)
    private String location;
    @Column(length = 240)
    private String address;
    private Boolean notificationsEnabled;

    @ElementCollection
    @CollectionTable(name = "attendee_favorites", joinColumns = @JoinColumn(name = "attendee_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"attendee_id", "event_id"}))
    @Column(name = "event_id", nullable = false)
    private java.util.Set<java.util.UUID> favorites = new java.util.HashSet<>();

    public String getLocation() { return location; }
    public String getAddress() { return address; }
    public boolean notificationsEnabled() { return Boolean.TRUE.equals(notificationsEnabled); }
    public void setNotificationsEnabled(boolean enabled) { notificationsEnabled = enabled; }

    protected Attendee() {}

    public Attendee(String id, String fullName, String email, String passwordHash) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.emailVerified = true;
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getPhone() { return phone; }
    public boolean isEmailVerified() { return Boolean.TRUE.equals(emailVerified); }
    public void markEmailVerified() { emailVerified = true; }

    public void updateProfile(String fullName, String phone, String location, String address) {
        this.fullName = fullName;
        this.phone = phone;
        if (location != null) this.location = location.strip();
        if (address != null) this.address = address.strip();
    }

    public void changePassword(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}
