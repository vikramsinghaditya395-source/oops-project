package com.voltflow.electricity.controller;

import com.voltflow.electricity.dto.ApiResponse;
import com.voltflow.electricity.model.Bill;
import com.voltflow.electricity.repository.BillRepository;
import com.voltflow.electricity.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillingService billingService;

    @GetMapping
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @GetMapping("/{billId}")
    public ResponseEntity<?> getBillById(@PathVariable String billId) {
        return billRepository.findByBillId(billId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateBill(@RequestBody Map<String, Object> payload) {
        try {
            String customerId = (String) payload.get("customerId");
            String meterNumber = (String) payload.get("meterNumber");
            int prev = ((Number) payload.get("previousReading")).intValue();
            int curr = ((Number) payload.get("currentReading")).intValue();

            Bill bill = billingService.generateBill(customerId, meterNumber, prev, curr);
            return ResponseEntity.ok(new ApiResponse(true, "Bill generated successfully", bill));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
