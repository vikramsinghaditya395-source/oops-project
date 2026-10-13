package com.voltflow.electricity.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String billId;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerType;

    @Column(nullable = false)
    private String meterNumber;

    private int previousReading;
    private int currentReading;
    private int unitsConsumed;
    private double ratePerUnit;
    private double energyCharge;
    private double fixedCharge;
    private double surchargeAmount;
    private double totalAmount;

    @Column(nullable = false)
    private String billDate;

    @Column(nullable = false)
    private String dueDate;

    @Column(nullable = false)
    private String paymentStatus; // "Paid", "Pending", "Overdue"

    public Bill() {}

    /**
     * OOP Method:
     * Generates a bill by calculating energy charges and applicable statutory surcharges.
     */
    public static Bill generate(Customer customer, Meter meter, Tariff tariff, String billDate, String dueDate) {
        int units = meter.calculateUnitsConsumed();
        double rate = tariff.getRatePerUnit();
        double energyCharge = units * rate;
        double fixed = tariff.getFixedMonthlyCharge();
        double surcharge = Math.round((energyCharge + fixed) * (tariff.getSurchargePercent() / 100.0));
        double total = energyCharge + fixed + surcharge;

        Bill bill = new Bill();
        bill.setBillId("INV-" + System.currentTimeMillis() % 1000000);
        bill.setCustomerId(customer.getCustomerId());
        bill.setCustomerName(customer.getName());
        bill.setCustomerType(customer.getCustomerType());
        bill.setMeterNumber(meter.getMeterNumber());
        bill.setPreviousReading(meter.getPreviousReading());
        bill.setCurrentReading(meter.getCurrentReading());
        bill.setUnitsConsumed(units);
        bill.setRatePerUnit(rate);
        bill.setEnergyCharge(energyCharge);
        bill.setFixedCharge(fixed);
        bill.setSurchargeAmount(surcharge);
        bill.setTotalAmount(total);
        bill.setBillDate(billDate);
        bill.setDueDate(dueDate);
        bill.setPaymentStatus("Pending");
        return bill;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBillId() { return billId; }
    public void setBillId(String billId) { this.billId = billId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }

    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }

    public int getPreviousReading() { return previousReading; }
    public void setPreviousReading(int previousReading) { this.previousReading = previousReading; }

    public int getCurrentReading() { return currentReading; }
    public void setCurrentReading(int currentReading) { this.currentReading = currentReading; }

    public int getUnitsConsumed() { return unitsConsumed; }
    public void setUnitsConsumed(int unitsConsumed) { this.unitsConsumed = unitsConsumed; }

    public double getRatePerUnit() { return ratePerUnit; }
    public void setRatePerUnit(double ratePerUnit) { this.ratePerUnit = ratePerUnit; }

    public double getEnergyCharge() { return energyCharge; }
    public void setEnergyCharge(double energyCharge) { this.energyCharge = energyCharge; }

    public double getFixedCharge() { return fixedCharge; }
    public void setFixedCharge(double fixedCharge) { this.fixedCharge = fixedCharge; }

    public double getSurchargeAmount() { return surchargeAmount; }
    public void setSurchargeAmount(double surchargeAmount) { this.surchargeAmount = surchargeAmount; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getBillDate() { return billDate; }
    public void setBillDate(String billDate) { this.billDate = billDate; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
