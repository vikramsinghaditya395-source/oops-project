package com.voltflow.electricity.repository;

import com.voltflow.electricity.model.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TariffRepository extends JpaRepository<Tariff, Long> {
    Optional<Tariff> findByCustomerTypeIgnoreCase(String customerType);
}
