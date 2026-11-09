package com.example.bokningssystem.repository;

import com.example.bokningssystem.entities.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findAllByUserId(@Param("userId") long userId);
    Optional<Membership> findByUserIdAndOrganizationId(long userId, long organizationId);
}
