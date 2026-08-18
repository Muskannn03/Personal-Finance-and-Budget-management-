package com.pbfm.repository;

import com.pbfm.entity.RiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RiskProfileRepository extends JpaRepository<RiskProfile, UUID> {
    Optional<RiskProfile> findByUser_UserId(UUID userId);
}
