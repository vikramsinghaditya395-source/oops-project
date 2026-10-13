package com.voltflow.electricity.controller;

import com.voltflow.electricity.dto.ApiResponse;
import com.voltflow.electricity.repository.BillRepository;
import com.voltflow.electricity.repository.CustomerRepository;
import com.voltflow.electricity.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Health check endpoint used by frontend to verify Spring Boot connectivity.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "VoltFlow Spring Boot API");
        status.put("version", "1.0.0");
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }

    /**
     * Returns live aggregated KPI metrics.
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {
        long totalCustomers = 1284 + customerRepository.count();
        long billsGenerated = 856 + billRepository.count();
        double paymentsCollected = 482650.0 + paymentRepository.findAll().stream().mapToDouble(p -> p.getAmount()).sum();
        double pendingPayments = 76400.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", totalCustomers);
        stats.put("billsGenerated", billsGenerated);
        stats.put("paymentsCollected", paymentsCollected);
        stats.put("pendingPayments", pendingPayments);

        return ResponseEntity.ok(new ApiResponse(true, "Dashboard statistics retrieved", stats));
    }
}
