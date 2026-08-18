package com.pbfm.repository;

import com.pbfm.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, UUID> {
    List<Investment> findByUser_UserId(UUID userId);
    List<Investment> findByGoal_GoalId(UUID goalId);
}
