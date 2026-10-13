package com.voltflow.electricity.controller;

import com.voltflow.electricity.dto.*;
import com.voltflow.electricity.model.User;
import com.voltflow.electricity.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/request-otp
     * Requests a 6-digit cryptographic OTP to the provided email.
     */
    @PostMapping("/request-otp")
    public ResponseEntity<ApiResponse> requestOtp(@Valid @RequestBody RequestOtpRequest request) {
        try {
            authService.requestOtp(request.getEmail());
            // Does not reveal whether user exists for security
            return ResponseEntity.ok(new ApiResponse(true, "If the email is valid, a single-use OTP has been sent."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * POST /api/auth/verify-otp
     * Validates 6-digit OTP, enforces expiry, and creates session.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.verifyOtp(request.getEmail(), request.getOtp());
        if (response.isSuccess()) {
            // Establish secure session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("USER_ID", response.getUser().getId());
            session.setAttribute("USER_EMAIL", response.getUser().getEmail());
            session.setAttribute("USER_ROLE", response.getUser().getRole());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * POST /api/auth/resend-otp
     * Resends OTP after 60-second cooldown check.
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        try {
            authService.resendOtp(request.getEmail());
            return ResponseEntity.ok(new ApiResponse(true, "New verification OTP dispatched."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(429).body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * GET /api/auth/me
     * Returns profile of current user.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("USER_EMAIL") != null) {
            return ResponseEntity.ok(new ApiResponse(true, "Authenticated", session.getAttribute("USER_EMAIL")));
        }
        return ResponseEntity.status(401).body(new ApiResponse(false, "Unauthenticated session"));
    }

    /**
     * POST /api/auth/logout
     * Invalidates active session.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
    }

    /**
     * POST /api/auth/register
     * Registers a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.registerUser(request);
            return ResponseEntity.ok(new ApiResponse(true, "Registration initiated. Verification OTP sent to " + user.getEmail(), user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
