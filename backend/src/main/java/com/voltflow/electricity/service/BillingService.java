package com.voltflow.electricity.service;

import com.voltflow.electricity.exception.InvalidPaymentException;
import com.voltflow.electricity.exception.ResourceNotFoundException;
import com.voltflow.electricity.model.*;
import com.voltflow.electricity.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillingService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private MeterRepository meterRepository;

    @Autowired
    private TariffRepository tariffRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Demonstrates POLYMORPHISM:
     * Generates an electricity bill using the customer's polymorphic calculateBill() logic.
     */
    @Transactional
    public Bill generateBill(String customerId, String meterNumber, int previousReading, int currentReading) {
        Customer customer = customerRepository.findByCustomerId(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

        Meter meter = meterRepository.findByMeterNumber(meterNumber)
            .orElseGet(() -> new Meter(meterNumber, previousReading, currentReading));

        meter.setReadings(previousReading, currentReading);
        meterRepository.save(meter);

        Tariff tariff = tariffRepository.findByCustomerTypeIgnoreCase(customer.getCustomerType())
            .orElseGet(() -> new Tariff(customer.getCustomerType(), 5.0, 50.0, 4.0, "2026-01-01", "Default"));

        String billDate = LocalDate.now().toString();
        String dueDate = LocalDate.now().plusDays(20).toString();

        Bill bill = Bill.generate(customer, meter, tariff, billDate, dueDate);
        return billRepository.save(bill);
    }

    /**
     * Demonstrates ENCAPSULATION and EXCEPTION HANDLING:
     * Validates payment amount > 0, prevents duplicate settlements, and updates bill status.
     */
    @Transactional
    public Payment recordPayment(String billId, double amount, String paymentMethod, String txRef) {
        Bill bill = billRepository.findByBillId(billId)
            .orElseThrow(() -> new ResourceNotFoundException("Bill not found: " + billId));

        if ("Paid".equalsIgnoreCase(bill.getPaymentStatus())) {
            throw new InvalidPaymentException("Bill " + billId + " has already been settled.");
        }

        if (amount <= 0) {
            throw new InvalidPaymentException("Payment amount must be strictly greater than zero.");
        }

        Payment payment = new Payment(
            bill.getBillId(),
            bill.getCustomerId(),
            bill.getCustomerName(),
            amount,
            paymentMethod,
            txRef,
            LocalDate.now().toString()
        );

        // Update bill status to Paid
        bill.setPaymentStatus("Paid");
        billRepository.save(bill);

        return paymentRepository.save(payment);
    }
}
