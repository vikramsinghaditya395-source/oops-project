package com.voltflow.electricity.service;

import com.voltflow.electricity.dto.AuthResponse;
import com.voltflow.electricity.dto.RegisterRequest;
import com.voltflow.electricity.model.OtpVerification;
import com.voltflow.electricity.model.User;
import com.voltflow.electricity.repository.OtpVerificationRepository;
import com.voltflow.electricity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    private static final int EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    /**
     * Step 1: Requests OTP for given email.
     * Generates a 6-digit code, hashes it, saves record, and dispatches email.
     */
    @Transactional
    public void requestOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();

        // Invalidate older unused OTPs for this email
        List<OtpVerification> existingOtps = otpRepository.findByEmailIgnoreCaseAndUsedFalse(cleanEmail);
        for (OtpVerification otp : existingOtps) {
            otp.setUsed(true);
            otpRepository.save(otp);
        }

        // Generate cryptographically secure 6-digit code
        String plainOtp = otpService.generateSixDigitOtp();
        String otpHash = otpService.hashOtp(plainOtp);

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(EXPIRY_MINUTES);
        OtpVerification verification = new OtpVerification(cleanEmail, otpHash, expiresAt);

        // Associate user ID if existing
        userRepository.findByEmailIgnoreCase(cleanEmail).ifPresent(user -> verification.setUserId(user.getId()));

        otpRepository.save(verification);

        // Send OTP email
        emailService.sendOtpEmail(cleanEmail, plainOtp);
    }

    /**
     * Step 2: Verifies submitted OTP against stored hash.
     */
    @Transactional
    public AuthResponse verifyOtp(String email, String plainOtp) {
        String cleanEmail = email.trim().toLowerCase();

        Optional<OtpVerification> optVerification = otpRepository
            .findTopByEmailIgnoreCaseAndUsedFalseOrderByCreatedAtDesc(cleanEmail);

        if (optVerification.isEmpty()) {
            return new AuthResponse(false, "No active OTP request found. Please request a new code.", null);
        }

        OtpVerification verification = optVerification.get();

        // 1. Check expiration (5 minutes)
        if (verification.isExpired()) {
            verification.setUsed(true);
            otpRepository.save(verification);
            return new AuthResponse(false, "The OTP has expired (5-minute validity). Please request a new code.", null);
        }

        // 2. Check maximum verification attempts (5 limit)
        if (verification.getAttempts() >= MAX_ATTEMPTS) {
            verification.setUsed(true);
            otpRepository.save(verification);
            return new AuthResponse(false, "Maximum verification attempts (5) exceeded. This OTP has been invalidated.", null);
        }

        // Increment attempts count
        verification.setAttempts(verification.getAttempts() + 1);

        // 3. Verify OTP cryptographic hash
        boolean matches = otpService.verifyOtpHash(plainOtp, verification.getOtpHash());
        if (!matches) {
            otpRepository.save(verification);
            int remaining = MAX_ATTEMPTS - verification.getAttempts();
            return new AuthResponse(false, "Invalid OTP code entered. (" + remaining + " attempts remaining)", null);
        }

        // 4. Mark OTP as used (single-use enforcement)
        verification.setUsed(true);
        otpRepository.save(verification);

        // 5. Retrieve or provision user
        User user = userRepository.findByEmailIgnoreCase(cleanEmail).orElseGet(() -> {
            boolean isAdmin = cleanEmail.contains("admin");
            User newUser = new User(
                cleanEmail.split("@")[0],
                cleanEmail,
                isAdmin ? "ADMIN" : "CUSTOMER",
                true
            );
            return userRepository.save(newUser);
        });

        return new AuthResponse(true, "Authentication successful!", user);
    }

    /**
     * Resends OTP with cooldown verification.
     */
    @Transactional
    public void resendOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();

        Optional<OtpVerification> latest = otpRepository
            .findTopByEmailIgnoreCaseAndUsedFalseOrderByCreatedAtDesc(cleanEmail);

        if (latest.isPresent()) {
            LocalDateTime cooldownLimit = latest.get().getCreatedAt().plusSeconds(RESEND_COOLDOWN_SECONDS);
            if (LocalDateTime.now().isBefore(cooldownLimit)) {
                throw new IllegalStateException("Please wait before requesting another OTP (60s cooldown).");
            }
        }

        requestOtp(cleanEmail);
    }

    /**
     * Registers a new user.
     */
    @Transactional
    public User registerUser(RegisterRequest req) {
        String cleanEmail = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("An account with this email address already exists.");
        }

        User user = new User(req.getName().trim(), cleanEmail, req.getRole() != null ? req.getRole() : "CUSTOMER", true);
        user.setCustomerType(req.getCustomerType());
        user.setMeterNumber(req.getMeterNumber());
        User saved = userRepository.save(user);

        // Initiate initial OTP verification email
        requestOtp(cleanEmail);
        return saved;
    }
}
