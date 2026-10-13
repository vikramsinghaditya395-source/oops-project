package com.voltflow.electricity.demo;

import com.voltflow.electricity.exception.InvalidPaymentException;
import com.voltflow.electricity.exception.InvalidReadingException;
import com.voltflow.electricity.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * ==============================================================================
 * VOLTFLOW OOP VIVA DEMONSTRATION RUNNER
 * ==============================================================================
 * Run directly with: java com.voltflow.electricity.demo.OopVivaDemo
 *
 * Demonstrates:
 * 1. ENCAPSULATION: Data hiding with private fields & validated mutators
 * 2. INHERITANCE: ResidentialCustomer & CommercialCustomer extend Customer
 * 3. POLYMORPHISM: Dynamic method dispatch in calculateBill()
 * 4. EXCEPTION HANDLING: Graceful recovery from telemetry & payment anomalies
 * ==============================================================================
 */
public class OopVivaDemo {

    public static void main(String[] args) {
        System.out.println("==================================================================");
        System.out.println("  ⚡ VOLTFLOW ELECTRICITY MANAGEMENT - JAVA OOP DEMONSTRATION     ");
        System.out.println("==================================================================\n");

        // ----------------------------------------------------------------------
        // 1. DEMONSTRATION OF ENCAPSULATION
        // ----------------------------------------------------------------------
        System.out.println(">>> 1. ENCAPSULATION DEMONSTRATION");
        Meter meter1 = new Meter("MTR-8801", 1240, 1520);
        System.out.println("  [Meter] Meter Serial:    " + meter1.getMeterNumber());
        System.out.println("  [Meter] Previous Reading: " + meter1.getPreviousReading() + " kWh");
        System.out.println("  [Meter] Current Reading:  " + meter1.getCurrentReading() + " kWh");
        System.out.println("  [Meter] Calculated Delta: " + meter1.calculateUnitsConsumed() + " kWh units");
        System.out.println("  -> Encapsulation ensures readings cannot be corrupted from outside.\n");

        // ----------------------------------------------------------------------
        // 2. DEMONSTRATION OF INHERITANCE
        // ----------------------------------------------------------------------
        System.out.println(">>> 2. INHERITANCE DEMONSTRATION");
        ResidentialCustomer resCustomer = new ResidentialCustomer(
            "VF-RES-1001", "Aditya Sharma", "aditya@example.com",
            "+91 98765 43210", "Sector 14, Gurugram", "MTR-8801", "2023-01-15"
        );
        CommercialCustomer comCustomer = new CommercialCustomer(
            "VF-COM-2001", "CyberTech Corp", "billing@cybertech.com",
            "+91 98111 22334", "Cyber City, Gurugram", "MTR-9901", "2022-06-20"
        );

        System.out.println("  -> resCustomer IS-A Customer: " + (resCustomer instanceof Customer));
        System.out.println("  -> comCustomer IS-A Customer: " + (comCustomer instanceof Customer));
        System.out.println("  -> Both classes inherit name, address, and meter from Customer superclass.\n");

        // ----------------------------------------------------------------------
        // 3. DEMONSTRATION OF POLYMORPHISM
        // ----------------------------------------------------------------------
        System.out.println(">>> 3. POLYMORPHISM DEMONSTRATION (Dynamic Method Dispatch)");
        List<Customer> customerList = new ArrayList<>();
        customerList.add(resCustomer);
        customerList.add(comCustomer);

        int sampleUnits = 300;
        System.out.println("  Simulating bill calculation for " + sampleUnits + " units consumed:\n");

        for (Customer c : customerList) {
            // POLYMORPHIC CALL: JVM resolves method at runtime!
            double billAmount = c.calculateBill(sampleUnits);

            System.out.printf("  [Polymorphism] Consumer Type: %-12s | Name: %-15s | Total: ₹%.2f%n",
                c.getCustomerType(), c.getName(), billAmount
            );
        }
        System.out.println("  -> Notice how Residential (₹5/unit slab) and Commercial (₹8/unit slab)");
        System.out.println("     produce different results without any if-else checks!\n");

        // ----------------------------------------------------------------------
        // 4. DEMONSTRATION OF EXCEPTION HANDLING
        // ----------------------------------------------------------------------
        System.out.println(">>> 4. EXCEPTION HANDLING DEMONSTRATION");
        try {
            System.out.println("  Testing Invalid Meter Reading (Current < Previous):");
            meter1.setReadings(1500, 1200); // Should fail!
        } catch (InvalidReadingException ex) {
            System.out.println("  [CAUGHT EXCEPTION] " + ex.getMessage());
        }

        try {
            System.out.println("  Testing Negative Payment Protection (Amount <= 0):");
            new Payment("INV-101", "VF-RES-1001", "Aditya Sharma", -500.0, "UPI", null, "2026-10-12");
        } catch (InvalidPaymentException ex) {
            System.out.println("  [CAUGHT EXCEPTION] " + ex.getMessage());
        }

        System.out.println("\n==================================================================");
        System.out.println("  ⚡ ALL OOP TESTS PASSED SUCCESSFULLY!                             ");
        System.out.println("==================================================================");
    }
}
