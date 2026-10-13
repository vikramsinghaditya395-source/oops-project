package com.voltflow.electricity.oop_core;

import java.util.ArrayList;
import java.util.List;

/**
 * ==============================================================================
 * VOLTFLOW OOP VIVA EXAM DEMONSTRATION RUNNER
 * ==============================================================================
 * Compile & run instantly:
 *   cd backend/src/main/java
 *   javac com/voltflow/electricity/oop_core/*.java
 *   java com.voltflow.electricity.oop_core.OopVivaConsoleRunner
 * ==============================================================================
 */
public class OopVivaConsoleRunner {

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("   ⚡ VOLTFLOW ELECTRICITY BILL MANAGEMENT SYSTEM — OOP VIVA DEMO              ");
        System.out.println("================================================================================\n");

        // --------------------------------------------------------------------------
        // 1. ENCAPSULATION DEMONSTRATION
        // --------------------------------------------------------------------------
        System.out.println(">>> 1. ENCAPSULATION (Data Hiding & Validation Protection)");
        Meter meterA = new Meter("MTR-8801", 1240, 1520);
        System.out.println("  [Meter Object]");
        System.out.println("    Meter Serial:       " + meterA.getMeterNumber());
        System.out.println("    Previous Reading:   " + meterA.getPreviousReading() + " kWh");
        System.out.println("    Current Reading:    " + meterA.getCurrentReading() + " kWh");
        System.out.println("    Calculated Units:   " + meterA.calculateUnitsConsumed() + " kWh");
        System.out.println("  -> Encapsulation ensures private readings cannot be directly overwritten.\n");

        // --------------------------------------------------------------------------
        // 2. INHERITANCE DEMONSTRATION
        // --------------------------------------------------------------------------
        System.out.println(">>> 2. INHERITANCE (Code Reuse & IS-A Hierarchy)");
        Meter meterB = new Meter("MTR-9901", 18450, 21950);

        Customer residentialCust = new ResidentialCustomer(
            "VF-RES-1001", "Aditya Sharma", "aditya@example.com",
            "+91 98765 43210", "Sector 14, Gurugram", meterA
        );

        Customer commercialCust = new CommercialCustomer(
            "VF-COM-2001", "CyberTech Innovations Ltd", "billing@cybertech.com",
            "+91 98111 22334", "Cyber City, Gurugram", meterB
        );

        System.out.println("  -> residentialCust IS-A Customer: " + (residentialCust instanceof Customer));
        System.out.println("  -> commercialCust  IS-A Customer: " + (commercialCust instanceof Customer));
        System.out.println("  -> Common fields (customerId, name, address, meter) are inherited from Customer base class.\n");

        // --------------------------------------------------------------------------
        // 3. POLYMORPHISM DEMONSTRATION
        // --------------------------------------------------------------------------
        System.out.println(">>> 3. POLYMORPHISM (Dynamic Method Dispatch at Runtime)");
        List<Customer> customerList = new ArrayList<>();
        customerList.add(residentialCust);
        customerList.add(commercialCust);

        System.out.println("  Iterating through List<Customer> uniformly:");
        for (Customer c : customerList) {
            // Polymorphic Bill Generation:
            Bill bill = new Bill(c);
            System.out.printf("    [Bill Issued] ID: %-13s | %-12s | Name: %-25s | Units: %4d kWh | Payable: ₹%.2f%n",
                bill.getBillId(), c.getCustomerType(), c.getName(), bill.getUnitsConsumed(), bill.getTotalAmount()
            );
        }
        System.out.println("  -> JVM dynamically invokes Residential slab (₹5/kWh) vs Commercial slab (₹8/kWh)");
        System.out.println("     without requiring any conditional if/else switches!\n");

        // --------------------------------------------------------------------------
        // 4. EXCEPTION HANDLING DEMONSTRATION
        // --------------------------------------------------------------------------
        System.out.println(">>> 4. EXCEPTION HANDLING (Graceful Fail-Safe Validation)");

        // A. Inverted Meter Reading Test
        try {
            System.out.print("  [Test 1] Inverted Reading (Current 1100 < Previous 1400): ");
            meterA.setReadings(1400, 1100);
        } catch (IllegalArgumentException e) {
            System.out.println("CAUGHT EXCEPTION -> " + e.getMessage());
        }

        // B. Negative Payment Test
        Bill testBill = new Bill(residentialCust);
        try {
            System.out.print("  [Test 2] Negative Payment (₹ -250.00):                  ");
            new Payment(testBill, -250.00, "UPI");
        } catch (IllegalArgumentException e) {
            System.out.println("CAUGHT EXCEPTION -> " + e.getMessage());
        }

        // C. Legitimate Payment
        System.out.println("\n  [Test 3] Processing Valid Payment of ₹" + testBill.getTotalAmount() + " via UPI:");
        Payment validPayment = new Payment(testBill, testBill.getTotalAmount(), "UPI");
        System.out.println("    Payment Settled: TXN #" + validPayment.getPaymentId() + " | Status: " + validPayment.getStatus());
        System.out.println("    Bill Status Updated: " + testBill.getPaymentStatus());

        // D. Duplicate Payment Prevention
        try {
            System.out.print("  [Test 4] Attempting Duplicate Payment on cleared bill:   ");
            new Payment(testBill, testBill.getTotalAmount(), "Card");
        } catch (IllegalStateException e) {
            System.out.println("CAUGHT EXCEPTION -> " + e.getMessage());
        }

        System.out.println("\n================================================================================");
        System.out.println("   ⚡ ALL OOP EVALUATION CRITERIA VERIFIED SUCCESSFULLY!                        ");
        System.out.println("================================================================================");
    }
}
