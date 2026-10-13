package com.voltflow.electricity.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tariffs")
public class Tariff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String customerType; // "Residential", "Commercial"

    @Column(nullable = false)
    private double ratePerUnit;

    @Column(nullable = false)
    private double fixedMonthlyCharge;

    @Column(nullable = false)
    private double surchargePercent;

    private String effectiveDate;
    private String description;

    public Tariff() {}

    public Tariff(String customerType, double ratePerUnit, double fixedMonthlyCharge, 
                  double surchargePercent, String effectiveDate, String description) {
        this.customerType = customerType;
        this.ratePerUnit = ratePerUnit;
        this.fixedMonthlyCharge = fixedMonthlyCharge;
        this.surchargePercent = surchargePercent;
        this.effectiveDate = effectiveDate;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }

    public double getRatePerUnit() { return ratePerUnit; }
    public void setRatePerUnit(double ratePerUnit) { this.ratePerUnit = ratePerUnit; }

    public double getFixedMonthlyCharge() { return fixedMonthlyCharge; }
    public void setFixedMonthlyCharge(double fixedMonthlyCharge) { this.fixedMonthlyCharge = fixedMonthlyCharge; }

    public double getSurchargePercent() { return surchargePercent; }
    public void setSurchargePercent(double surchargePercent) { this.surchargePercent = surchargePercent; }

    public String getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(String effectiveDate) { this.effectiveDate = effectiveDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
