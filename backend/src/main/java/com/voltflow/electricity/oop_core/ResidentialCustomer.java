package com.voltflow.electricity.oop_core;

/**
 * ==============================================================================
 * 2. INHERITANCE & 3. POLYMORPHISM
 * ==============================================================================
 * Subclass extending Customer. Inherits base fields and implements domestic tariff logic.
 */
public class ResidentialCustomer extends Customer {
    private double residentialTariffRate; // ₹5.00/unit
    private double fixedMonthlyCharge;    // ₹50.00
    private double surchargePercent;       // 4%

    public ResidentialCustomer(String customerId, String name, String email, String phone, String address, Meter meter) {
        super(customerId, name, email, phone, address, meter);
        this.residentialTariffRate = 5.0;
        this.fixedMonthlyCharge = 50.0;
        this.surchargePercent = 4.0;
    }

    /**
     * Polymorphic Calculation for Residential:
     * (Units × ₹5) + ₹50 + 4% Surcharge
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
    public double getFixedMonthlyCharge() { return fixedMonthlyCharge; }
    public double getSurchargePercent() { return surchargePercent; }
}
