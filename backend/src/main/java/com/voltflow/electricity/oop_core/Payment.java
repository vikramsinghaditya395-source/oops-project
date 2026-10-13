package com.voltflow.electricity.oop_core;

public class Payment {
    private String paymentId;
    private Bill bill;
    private double amount;
    private String paymentMethod;
    private String status;

    public Payment(Bill bill, double amount, String paymentMethod) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Invalid Payment: Amount must be greater than zero! Received: ₹" + amount);
        }
        if ("Paid".equalsIgnoreCase(bill.getPaymentStatus())) {
            throw new IllegalStateException("Duplicate Settlement: Bill " + bill.getBillId() + " has already been paid!");
        }
        this.paymentId = "TXN-" + (10000 + (int)(Math.random() * 90000));
        this.bill = bill;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = "Success";
        bill.setPaymentStatus("Paid");
    }

    public String getPaymentId() { return paymentId; }
    public Bill getBill() { return bill; }
    public double getAmount() { return amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getStatus() { return status; }
}
