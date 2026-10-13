package com.voltflow.electricity.model;

import com.voltflow.electricity.exception.InvalidPaymentException;
import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String paymentId;

    @Column(nullable = false)
    private String billId;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String paymentDate;

    @Column(nullable = false)
    private String paymentMethod; // UPI, Cash, Card, Bank Transfer

    @Column(nullable = false)
    private String transactionReference;

    @Column(nullable = false)
    private String paymentStatus; // "Success", "Failed"

    public Payment() {}

    /**
     * OOP Method:
     * Validates payment invariants (positive amount and non-null mode)
     */
    public Payment(String billId, String customerId, String customerName, 
                   double amount, String paymentMethod, String transactionReference, String paymentDate) {
        if (amount <= 0) {
            throw new InvalidPaymentException("Payment amount must be greater than zero. Received: " + amount);
        }
        if (paymentMethod == null || paymentMethod.trim().isEmpty()) {
            throw new InvalidPaymentException("Payment method is required.");
        }
        this.paymentId = "TXN-" + (10000 + (long)(Math.random() * 90000));
        this.billId = billId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.transactionReference = transactionReference != null && !transactionReference.trim().isEmpty() 
            ? transactionReference 
            : paymentMethod + "/TXN-" + System.currentTimeMillis() % 1000000;
        this.paymentDate = paymentDate;
        this.paymentStatus = "Success";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getBillId() { return billId; }
    public void setBillId(String billId) { this.billId = billId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
