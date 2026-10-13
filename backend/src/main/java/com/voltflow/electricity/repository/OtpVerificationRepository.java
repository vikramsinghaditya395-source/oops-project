package com.voltflow.electricity.repository;

import com.voltflow.electricity.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByEmailIgnoreCaseAndUsedFalseOrderByCreatedAtDesc(String email);
    List<OtpVerification> findByEmailIgnoreCaseAndUsedFalse(String email);
}
