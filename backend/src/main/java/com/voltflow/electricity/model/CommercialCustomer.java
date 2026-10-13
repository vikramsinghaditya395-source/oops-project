package com.voltflow.electricity.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Demonstrates INHERITANCE and POLYMORPHISM:
 * Specializes Customer for commercial enterprises with high load tariffs.
 */
@Entity
@DiscriminatorValue("Commercial")
public class CommercialCustomer extends Customer {

    private double commercialTariffRate = 8.0; // ₹8 per unit as specified
    private double fixedMonthlyCharge = 50.0;   // ₹50 fixed charge
    private double surchargePercent = 6.0;      // 6% commercial power factor surcharge

    public CommercialCustomer() {
        super();
    }

    public CommercialCustomer(String customerId, String name, String email, String phone, 
                              String address, String meterNumber, String connectionDate) {
        super(customerId, name, email, phone, address, meterNumber, connectionDate);
    }

    /**
     * Polymorphic implementation for commercial billing:
     * Energy Charge = Units × ₹8
     * Total = Energy Charge + Fixed Charge + 6% Surcharge
     */
    @Override
    public double calculateBill(int unitsConsumed) {
        double energyCharge = unitsConsumed * this.commercialTariffRate;
        double subtotal = energyCharge + this.fixedMonthlyCharge;
        double surcharge = Math.round(subtotal * (this.surchargePercent / 100.0));
        return subtotal + surcharge;
    }

    @Override
    public String getCustomerType() {
        return "Commercial";
    }

    public double getCommercialTariffRate() { return commercialTariffRate; }
    public void setCommercialTariffRate(double commercialTariffRate) { this.commercialTariffRate = commercialTariffRate; }

    public double getFixedMonthlyCharge() { return fixedMonthlyCharge; }
    public void setFixedMonthlyCharge(double fixedMonthlyCharge) { this.fixedMonthlyCharge = fixedMonthlyCharge; }

    public double getSurchargePercent() { return surchargePercent; }
    public void setSurchargePercent(double surchargePercent) { this.surchargePercent = surchargePercent; }
}
