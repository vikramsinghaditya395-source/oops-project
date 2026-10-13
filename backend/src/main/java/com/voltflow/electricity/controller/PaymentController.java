package com.voltflow.electricity.controller;

import com.voltflow.electricity.dto.ApiResponse;
import com.voltflow.electricity.model.Payment;
import com.voltflow.electricity.repository.PaymentRepository;
import com.voltflow.electricity.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillingService billingService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> recordPayment(@RequestBody Map<String, Object> payload) {
        try {
            String billId = (String) payload.get("billId");
            double amount = ((Number) payload.get("amount")).doubleValue();
            String method = (String) payload.get("paymentMethod");
            String txRef = (String) payload.get("transactionReference");

            Payment payment = billingService.recordPayment(billId, amount, method, txRef);
            return ResponseEntity.ok(new ApiResponse(true, "Payment recorded successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
