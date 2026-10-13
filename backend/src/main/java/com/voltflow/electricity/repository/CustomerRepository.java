package com.voltflow.electricity.repository;

import com.voltflow.electricity.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerId(String customerId);
    Optional<Customer> findByMeterNumber(String meterNumber);
    boolean existsByMeterNumber(String meterNumber);
}
