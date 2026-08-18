package com.pbfm.repository;

import com.pbfm.entity.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RewardRepository extends JpaRepository<Reward, UUID> {
    List<Reward> findByUser_UserId(UUID userId);
    List<Reward> findByAccount_AccountId(UUID accountId);
}
