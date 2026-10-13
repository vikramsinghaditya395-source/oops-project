package com.voltflow.electricity.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Demonstrates INHERITANCE and POLYMORPHISM:
 * Specializes Customer for domestic residential households.
 */
@Entity
@DiscriminatorValue("Residential")
public class ResidentialCustomer extends Customer {

    private double residentialTariffRate = 5.0; // ₹5 per unit as specified
    private double fixedMonthlyCharge = 50.0;   // ₹50 fixed charge
    private double surchargePercent = 4.0;      // 4% statutory energy surcharge

    public ResidentialCustomer() {
        super();
    }

    public ResidentialCustomer(String customerId, String name, String email, String phone, 
                               String address, String meterNumber, String connectionDate) {
        super(customerId, name, email, phone, address, meterNumber, connectionDate);
    }

    /**
     * Polymorphic implementation for domestic billing:
     * Energy Charge = Units × ₹5
     * Total = Energy Charge + Fixed Charge + Surcharge
     */
    @Override
    public double calculateBill(int unitsConsumed) {
        double energyCharge = unitsConsumed * this.residentialTariffRate;
        double subtotal = energyCharge + this.fixedMonthlyCharge;
        double surcharge = Math.round(subtotal * (this.surchargePercent / 100.0));
        return subtotal + surcharge;
    }

    @Override
    public String getCustomerType() {
        return "Residential";
    }

    public double getResidentialTariffRate() { return residentialTariffRate; }
    public void setResidentialTariffRate(double residentialTariffRate) { this.residentialTariffRate = residentialTariffRate; }

    public double getFixedMonthlyCharge() { return fixedMonthlyCharge; }
    public void setFixedMonthlyCharge(double fixedMonthlyCharge) { this.fixedMonthlyCharge = fixedMonthlyCharge; }

    public double getSurchargePercent() { return surchargePercent; }
    public void setSurchargePercent(double surchargePercent) { this.surchargePercent = surchargePercent; }
}
