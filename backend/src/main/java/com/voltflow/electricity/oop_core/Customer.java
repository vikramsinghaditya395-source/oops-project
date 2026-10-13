package com.voltflow.electricity.oop_core;

/**
 * ==============================================================================
 * 1. ENCAPSULATION & ABSTRACTION
 * ==============================================================================
 * Abstract superclass representing a general electricity consumer.
 * Private fields protect data integrity; accessible only via getters/setters.
 */
public abstract class Customer {
    private String customerId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Meter meter;
    private String accountStatus;

    public Customer(String customerId, String name, String email, String phone, String address, Meter meter) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID cannot be empty");
        }
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.meter = meter;
        this.accountStatus = "Active";
    }

    /**
     * POLYMORPHIC ABSTRACT METHOD:
     * Overridden in subclasses with category-specific tariff formulas.
     */
    public abstract double calculateBill(int unitsConsumed);

    public abstract String getCustomerType();

    // Getters and Setters
    public String getCustomerId() { return customerId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public Meter getMeter() { return meter; }
    public String getAccountStatus() { return accountStatus; }

    public void setAddress(String address) {
        if (address != null && !address.trim().isEmpty()) {
            this.address = address;
        }
    }
}
