package com.voltflow.electricity.controller;

import com.voltflow.electricity.dto.ApiResponse;
import com.voltflow.electricity.model.Customer;
import com.voltflow.electricity.model.ResidentialCustomer;
import com.voltflow.electricity.model.CommercialCustomer;
import com.voltflow.electricity.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Map<String, Object> payload) {
        String type = (String) payload.getOrDefault("customerType", "Residential");
        String customerId = (String) payload.get("customerId");
        String name = (String) payload.get("name");
        String email = (String) payload.get("email");
        String phone = (String) payload.get("phone");
        String address = (String) payload.get("address");
        String meterNumber = (String) payload.get("meterNumber");
        String connectionDate = (String) payload.getOrDefault("connectionDate", "2026-01-01");

        Customer customer;
        if ("Commercial".equalsIgnoreCase(type)) {
            customer = new CommercialCustomer(customerId, name, email, phone, address, meterNumber, connectionDate);
        } else {
            customer = new ResidentialCustomer(customerId, name, email, phone, address, meterNumber, connectionDate);
        }

        Customer saved = customerRepository.save(customer);
        return ResponseEntity.ok(new ApiResponse(true, "Customer created successfully", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Customer record deleted"));
    }
}
