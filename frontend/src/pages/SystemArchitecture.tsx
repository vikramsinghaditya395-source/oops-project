import React, { useState } from 'react';
import {
  Code2,
  Layers,
  Copy,
  Check,
  Shield,
  GitBranch,
  Cpu,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'encapsulation' | 'inheritance' | 'polymorphism' | 'exceptions'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const oopConcepts = [
    {
      id: 'encapsulation',
      name: '1. Encapsulation',
      tagline: 'Data Hiding & Validation Protection',
      description:
        'Encapsulation bundles data (fields) and methods operating on that data into classes, restricting direct access from outside via private variables and exposing validated public getters/setters.',
      vivaTip:
        'Viva Answer: "Encapsulation prevents unauthorized external mutations. For example, in our Customer class, the customerId and meterNumber are private, and mutators ensure negative tariff inputs or malformed IDs are rejected."',
      code: `package com.voltflow.electricity.model;

/**
 * Demonstrates ENCAPSULATION:
 * Private fields guarantee data integrity.
 * State is accessed only through validated getters & setters.
 */
public abstract class Customer {
    private String customerId;
    private String name;
    private String address;
    private Meter meter;
    private String accountStatus;

    public Customer(String customerId, String name, String address, Meter meter) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID cannot be null or empty");
        }
        this.customerId = customerId;
        this.name = name;
        this.address = address;
        this.meter = meter;
        this.accountStatus = "Active";
    }

    // Encapsulated Getters
    public String getCustomerId() { return customerId; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public Meter getMeter() { return meter; }
    public String getAccountStatus() { return accountStatus; }

    // Controlled Setters with invariant checks
    public void setAddress(String address) {
        if (address != null && !address.trim().isEmpty()) {
            this.address = address;
        }
    }

    // Abstract polymorphic method
    public abstract double calculateBill(int unitsConsumed);
}`,
    },
    {
      id: 'inheritance',
      name: '2. Inheritance',
      tagline: 'Reusability & Class Hierarchies',
      description:
        'Inheritance allows subclass specializations (ResidentialCustomer & CommercialCustomer) to extend the common Customer superclass, inheriting attributes while adding distinct tariff configurations.',
      vivaTip:
        'Viva Answer: "Inheritance models an IS-A relationship. ResidentialCustomer IS-A Customer, and CommercialCustomer IS-A Customer. Common attributes like name, meter, and address are defined once in Customer, preventing redundant code."',
      code: `package com.voltflow.electricity.model;

/**
 * Demonstrates INHERITANCE:
 * ResidentialCustomer extends Customer and inherits all base attributes.
 */
public class ResidentialCustomer extends Customer {
    // Specialized tariff configuration for domestic households
    private double residentialRatePerUnit; // e.g. ₹5.00
    private double fixedMonthlyCharge;     // e.g. ₹50.00
    private double taxSurchargePercent;    // e.g. 4%

    public ResidentialCustomer(String customerId, String name, String address, 
                               Meter meter, double ratePerUnit) {
        super(customerId, name, address, meter); // Calls superclass constructor
        this.residentialRatePerUnit = ratePerUnit;
        this.fixedMonthlyCharge = 50.0;
        this.taxSurchargePercent = 4.0;
    }

    @Override
    public double calculateBill(int unitsConsumed) {
        double energyCharge = unitsConsumed * this.residentialRatePerUnit;
        double subtotal = energyCharge + this.fixedMonthlyCharge;
        double surcharge = subtotal * (this.taxSurchargePercent / 100.0);
        return subtotal + surcharge;
    }
}`,
    },
    {
      id: 'polymorphism',
      name: '3. Polymorphism',
      tagline: 'Dynamic Method Dispatch at Runtime',
      description:
        'Polymorphism allows Customer references to execute different calculateBill() logic at runtime depending on whether the concrete object is a ResidentialCustomer or CommercialCustomer.',
      vivaTip:
        'Viva Answer: "Polymorphism enables the billing service to iterate through a List<Customer> and invoke customer.calculateBill(units). At runtime, Java JVM dynamically dispatches to ResidentialCustomer\'s ₹5 slab or CommercialCustomer\'s ₹8 high-voltage slab without if-else checks."',
      code: `package com.voltflow.electricity.service;

import com.voltflow.electricity.model.*;
import java.util.List;

/**
 * Demonstrates POLYMORPHISM:
 * Dynamic method dispatch processes heterogeneous customers uniformly.
 */
public class BillingService {

    public void processAllBills(List<Customer> customers) {
        for (Customer customer : customers) {
            int units = customer.getMeter().calculateUnitsConsumed();

            // POLYMORPHIC CALL:
            // JVM resolves calculateBill() based on concrete runtime instance!
            double totalPayable = customer.calculateBill(units);

            System.out.println("Customer [" + customer.getCustomerId() + "] "
                + customer.getName() + " -> Total Payable: ₹" + totalPayable);
        }
    }
}`,
    },
    {
      id: 'exceptions',
      name: '4. Robust Exception Handling',
      tagline: 'Defensive Domain Validation & Fail-safe Error Handling',
      description:
        'Custom business exceptions protect the utility domain against invalid meter telemetry, inverted readings, negative payments, and duplicate settlements.',
      vivaTip:
        'Viva Answer: "We created custom checked/unchecked exceptions like InvalidReadingException and InvalidPaymentException to gracefully catch anomalies before writing to the database."',
      code: `package com.voltflow.electricity.exception;

/**
 * Custom domain exceptions prevent corrupted meter records.
 */
public class InvalidReadingException extends RuntimeException {
    public InvalidReadingException(String message) {
        super(message);
    }
}

// In Meter.java:
public int calculateUnitsConsumed() {
    if (this.currentReading < this.previousReading) {
        throw new InvalidReadingException(
            "Current reading (" + currentReading + " kWh) cannot be less than " +
            "previous reading (" + previousReading + " kWh)!"
        );
    }
    return this.currentReading - this.previousReading;
}`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              College Project Showcase
            </span>
            <span className="text-xs font-mono text-slate-400">Java 17+ / Spring Boot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Architecture & Java OOP Principles
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Detailed breakdown of Class Hierarchies, Encapsulation, Polymorphism, and Domain Exceptions for project evaluation and viva examination.
          </p>
        </div>
      </div>

      {/* Visual UML Class Hierarchy Diagram */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Core OOP Class Hierarchy Diagram
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              UML representation of entities, inheritance relationships, and method contracts
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full font-semibold">
            Java OOP Model
          </span>
        </div>

        {/* Visual Class Diagram Cards */}
        <div className="space-y-6">
          {/* Top Level: Base Customer & Meter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer (Abstract Base Class) */}
            <div className="border-2 border-emerald-500/40 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
              <div className="bg-emerald-600 text-white p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider opacity-80">&lt;&lt;Abstract Superclass&gt;&gt;</span>
                <h4 className="text-sm font-bold font-mono">Customer</h4>
              </div>
              <div className="p-4 space-y-3 text-xs font-mono">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2 space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="text-slate-500 text-[10px] uppercase font-sans">Fields (Private - Encapsulated):</div>
                  <div>- customerId : String</div>
                  <div>- name : String</div>
                  <div>- address : String</div>
                  <div>- meter : Meter</div>
                  <div>- accountStatus : String</div>
                </div>
                <div className="space-y-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <div className="text-slate-500 text-[10px] uppercase font-sans font-normal">Methods (Public):</div>
                  <div>+ getCustomerId() : String</div>
                  <div>+ getName() : String</div>
                  <div>+ getMeter() : Meter</div>
                  <div className="bg-emerald-100/50 dark:bg-emerald-950/60 p-1 rounded font-bold">
                    + abstract calculateBill(int units) : double
                  </div>
                </div>
              </div>
            </div>

            {/* Meter Class */}
            <div className="border-2 border-blue-500/40 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
              <div className="bg-blue-600 text-white p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider opacity-80">&lt;&lt;Telemetry Entity&gt;&gt;</span>
                <h4 className="text-sm font-bold font-mono">Meter</h4>
              </div>
              <div className="p-4 space-y-3 text-xs font-mono">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2 space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="text-slate-500 text-[10px] uppercase font-sans">Fields:</div>
                  <div>- meterNumber : String</div>
                  <div>- previousReading : int</div>
                  <div>- currentReading : int</div>
                </div>
                <div className="space-y-1 text-blue-700 dark:text-blue-400 font-semibold">
                  <div className="text-slate-500 text-[10px] uppercase font-sans font-normal">Methods:</div>
                  <div>+ getMeterNumber() : String</div>
                  <div>+ recordReading(int prev, int curr) : void</div>
                  <div className="bg-blue-100/50 dark:bg-blue-950/60 p-1 rounded font-bold">
                    + calculateUnitsConsumed() : int
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inheritance Arrow Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest my-2">
            <span className="w-16 h-px bg-slate-300 dark:bg-slate-700" />
            <span>Extends &amp; Specializes (Inheritance)</span>
            <span className="w-16 h-px bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Subclasses: Residential & Commercial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ResidentialCustomer */}
            <div className="border-2 border-emerald-500/30 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
              <div className="bg-emerald-700 text-white p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider opacity-80">Subclass extends Customer</span>
                <h4 className="text-sm font-bold font-mono">ResidentialCustomer</h4>
              </div>
              <div className="p-4 space-y-2.5 text-xs font-mono">
                <div className="text-slate-700 dark:text-slate-300">
                  <div>- residentialRatePerUnit : double (₹5.0)</div>
                  <div>- fixedMonthlyCharge : double (₹50.0)</div>
                  <div>- taxSurchargePercent : double (4%)</div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded">
                  + @Override calculateBill(int units) : double
                  <div className="text-[11px] font-sans font-normal text-slate-500 dark:text-slate-400 mt-1">
                    Formula: (units × ₹5) + ₹50 + 4% Surcharge
                  </div>
                </div>
              </div>
            </div>

            {/* CommercialCustomer */}
            <div className="border-2 border-purple-500/30 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
              <div className="bg-purple-700 text-white p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider opacity-80">Subclass extends Customer</span>
                <h4 className="text-sm font-bold font-mono">CommercialCustomer</h4>
              </div>
              <div className="p-4 space-y-2.5 text-xs font-mono">
                <div className="text-slate-700 dark:text-slate-300">
                  <div>- commercialRatePerUnit : double (₹8.0)</div>
                  <div>- fixedMonthlyCharge : double (₹50.0)</div>
                  <div>- powerFactorSurcharge : double (6%)</div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 text-purple-700 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/40 p-2 rounded">
                  + @Override calculateBill(int units) : double
                  <div className="text-[11px] font-sans font-normal text-slate-500 dark:text-slate-400 mt-1">
                    Formula: (units × ₹8) + ₹50 + 6% Surcharge
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Associated Transactional Classes: Bill & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            {/* Bill */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 text-xs font-mono">
              <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Class: Bill</span>
                <span className="text-[10px] text-slate-400 uppercase font-sans">Entity</span>
              </div>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <div>- billId : String</div>
                <div>- unitsConsumed : int</div>
                <div>- totalAmount : double</div>
                <div>- paymentStatus : String</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                  + generateBill(Customer c, Meter m) : Bill
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 text-xs font-mono">
              <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Class: Payment</span>
                <span className="text-[10px] text-slate-400 uppercase font-sans">Entity</span>
              </div>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <div>- paymentId : String</div>
                <div>- amount : double</div>
                <div>- paymentMethod : String</div>
                <div>- transactionRef : String</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                  + recordPayment(Bill b, double amount) : void
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all', 'encapsulation', 'inheritance', 'polymorphism', 'exceptions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab === 'all' ? 'All OOP Concepts' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Detailed Concept Cards with Code Snippets & Viva Explanations */}
      <div className="space-y-6">
        {oopConcepts
          .filter(c => activeTab === 'all' || c.id === activeTab)
          .map(concept => (
            <div
              key={concept.id}
              className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-subtle space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {concept.name}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    {concept.tagline}
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-500 self-start sm:self-auto">
                  Java Production Implementation
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {concept.description}
              </p>

              {/* Viva Exam Tip Box */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-semibold block text-amber-800 dark:text-amber-300">
                    Viva Answer Framework:
                  </strong>
                  {concept.vivaTip}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0B0F17] text-slate-200 text-xs font-mono">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Java Source Code Snippet</span>
                  </div>
                  <button
                    onClick={() => copyCode(concept.id, concept.code)}
                    className="flex items-center gap-1 text-[11px] hover:text-white text-slate-400 transition-colors"
                  >
                    {copiedKey === concept.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed text-emerald-300">
                  <code>{concept.code}</code>
                </pre>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
