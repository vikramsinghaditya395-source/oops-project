package com.voltflow.electricity.model;

import jakarta.persistence.*;

/**
 * Demonstrates OOP ENCAPSULATION and INHERITANCE:
 * Abstract base class representing generic electricity consumers.
 */
@Entity
@Table(name = "customers")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "customer_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String customerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String address;

    @Column(nullable = false)
    private String meterNumber;

    private String connectionDate;
    private String accountStatus; // "Active", "Inactive"
    private int sanctionedLoadKw;

    public Customer() {}

    public Customer(String customerId, String name, String email, String phone, 
                    String address, String meterNumber, String connectionDate) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID cannot be empty");
        }
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.meterNumber = meterNumber;
        this.connectionDate = connectionDate;
        this.accountStatus = "Active";
        this.sanctionedLoadKw = 5;
    }

    /**
     * Demonstrates POLYMORPHISM:
     * Abstract method implemented differently by ResidentialCustomer and CommercialCustomer.
     *
     * @param unitsConsumed number of kWh units consumed
     * @return calculated total bill amount
     */
    public abstract double calculateBill(int unitsConsumed);

    public abstract String getCustomerType();

    // Encapsulated Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }

    public String getConnectionDate() { return connectionDate; }
    public void setConnectionDate(String connectionDate) { this.connectionDate = connectionDate; }

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }

    public int getSanctionedLoadKw() { return sanctionedLoadKw; }
    public void setSanctionedLoadKw(int sanctionedLoadKw) { this.sanctionedLoadKw = sanctionedLoadKw; }
}
