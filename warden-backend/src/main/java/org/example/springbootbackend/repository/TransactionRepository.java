package org.example.springbootbackend.repository;

import org.example.springbootbackend.entity.TransactionEntityTraining;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntityTraining, Long> {
    // Inherits standard, high-performance batch insert operations (saveAll)
}
