package com.voltflow.electricity.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

@Service
public class OtpService {

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generates a cryptographically secure 6-digit numeric OTP.
     */
    public String generateSixDigitOtp() {
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }

    /**
     * Hashes plaintext OTP using SHA-256 before database storage.
     * Plaintext OTPs are never stored in the database.
     */
    public String hashOtp(String plainOtp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(plainOtp.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Verifies user-entered OTP against the stored SHA-256 hash.
     */
    public boolean verifyOtpHash(String enteredOtp, String storedHash) {
        if (enteredOtp == null || storedHash == null) return false;
        String enteredHash = hashOtp(enteredOtp);
        return enteredHash.equalsIgnoreCase(storedHash);
    }
}
