//This repository allows Spring Boot to save admin accounts, retrieve registered accounts and check for duplicate emails.

package com.community360.eventcreation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {

    boolean existsByEmail(String email);

    Optional<Admin> findByEmail(String email);

    @Query(value = "SELECT nextval('admin_id_seq')", nativeQuery = true)
    long getNextAdminNumber();
}