package com.voltflow.electricity.oop_core;

/**
 * ==============================================================================
 * 2. INHERITANCE & 3. POLYMORPHISM
 * ==============================================================================
 * Subclass extending Customer. Inherits base fields and implements commercial tariff logic.
 */
public class CommercialCustomer extends Customer {
    private double commercialTariffRate; // ₹8.00/unit
    private double fixedMonthlyCharge;   // ₹50.00
    private double surchargePercent;      // 6%

    public CommercialCustomer(String customerId, String name, String email, String phone, String address, Meter meter) {
        super(customerId, name, email, phone, address, meter);
        this.commercialTariffRate = 8.0;
        this.fixedMonthlyCharge = 50.0;
        this.surchargePercent = 6.0;
    }

    /**
     * Polymorphic Calculation for Commercial:
     * (Units × ₹8) + ₹50 + 6% Surcharge
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
    public double getFixedMonthlyCharge() { return fixedMonthlyCharge; }
    public double getSurchargePercent() { return surchargePercent; }
}
