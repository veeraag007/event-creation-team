//This class defines the structure of the admins table in PostgreSQL

package com.community360.eventcreation;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    private String communityId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String organization;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    protected Admin() {
    }

    public Admin(String communityId, String fullName,
                 String organization, String email,
                 String passwordHash) {

        this.communityId = communityId;
        this.fullName = fullName;
        this.organization = organization;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public String getCommunityId() {
        return communityId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getOrganization() {
        return organization;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }
}