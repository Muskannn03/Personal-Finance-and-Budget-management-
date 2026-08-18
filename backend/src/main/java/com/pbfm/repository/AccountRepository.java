package com.pbfm.repository;

import com.pbfm.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByUser_UserId(UUID userId);
    
    @Query("SELECT COALESCE(SUM(a.balance), 0) FROM Account a WHERE a.user.userId = :userId")
    BigDecimal getNetWorthByUserId(@Param("userId") UUID userId);
}
