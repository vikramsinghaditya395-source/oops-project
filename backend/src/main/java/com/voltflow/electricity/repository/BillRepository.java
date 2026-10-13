package com.voltflow.electricity.repository;

import com.voltflow.electricity.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByBillId(String billId);
    List<Bill> findByCustomerId(String customerId);
    List<Bill> findByPaymentStatus(String paymentStatus);
}
