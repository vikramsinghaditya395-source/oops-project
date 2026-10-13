package com.voltflow.electricity.oop_core;

public class Bill {
    private String billId;
    private Customer customer;
    private int unitsConsumed;
    private double totalAmount;
    private String paymentStatus;

    public Bill(Customer customer) {
        this.billId = "INV-2026-" + (1000 + (int)(Math.random() * 9000));
        this.customer = customer;
        this.unitsConsumed = customer.getMeter().calculateUnitsConsumed();
        // Polymorphic delegation:
        this.totalAmount = customer.calculateBill(this.unitsConsumed);
        this.paymentStatus = "Pending";
    }

    public String getBillId() { return billId; }
    public Customer getCustomer() { return customer; }
    public int getUnitsConsumed() { return unitsConsumed; }
    public double getTotalAmount() { return totalAmount; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
