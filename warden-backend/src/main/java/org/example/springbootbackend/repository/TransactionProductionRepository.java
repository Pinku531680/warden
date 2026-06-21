package org.example.springbootbackend.repository;

import org.example.springbootbackend.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionProductionRepository extends JpaRepository<TransactionEntity, String> {
    // Inherits high-performance single and bulk operations bound to transactions_production
    // Finds all records matching a specific status created BEFORE a given cutoff timestamp window
    List<TransactionEntity> findByStatusAndInsertedAtBefore(String status, java.time.LocalDateTime cutoffTime);
}
