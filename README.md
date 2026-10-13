# ⚡ VoltFlow — Electricity Bill Management System

> **Tagline:** *"Powering smarter energy management."*  
> **Type:** Full-Stack Object-Oriented Programming (OOP) Demonstration Project  
> **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons, React Router  
> **Backend:** Java 17+, Spring Boot 3.3.4, Spring Security, Spring Data JPA, Spring Mail, H2/MySQL  

---

## 🌟 Project Overview

**VoltFlow** is an enterprise-grade utility SaaS platform built for a college Object-Oriented Programming (OOP) viva and demonstration project. It models a modern smart-grid electricity distribution company (DISCOM) featuring:
- **Interactive Overview Dashboard:** Real-time KPI statistics (Total Customers, Invoices Issued, Collections Realized, Outstanding Balances), telemetry consumption trends, and revenue realization graphs.
- **Smart Meter Telemetry:** Delta unit consumption computation (`Units = Current Reading − Previous Reading`) with invariant checks (`Current >= Previous`).
- **Dynamic Tariff Engine:** Configurable slabs for domestic (`ResidentialCustomer` @ ₹5.00/unit) and enterprise (`CommercialCustomer` @ ₹8.00/unit) with fixed monthly connection charges (₹50) and regulatory tax surcharges.
- **Automated Invoicing & Official Statements:** Printable and downloadable tax invoices with complete itemized charge breakdowns.
- **Payment Settlement System:** Multi-mode transactions (UPI, Debit/Credit Card, Net Banking, Counter Cash), duplicate-payment prevention, balance reconciliation, and official printable receipt generation.
- **Passwordless OTP-Based Authentication:** Cryptographically secure 6-digit random code generation (`SecureRandom`), SHA-256 database hashing, 5-minute single-use expiry, 60-second resend cooldown, attempt limiting (max 5), and HTML email templates.
- **Dedicated System Architecture & OOP Showcase:** Interactive UML diagrams and code mappings explaining Encapsulation, Inheritance, Polymorphism, and Exception Handling for viva examination.

---

## 📁 Repository Structure

```
oops project/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Sidebar, Topbar, Shell
│   │   │   ├── ui/               # StatCard, Badge, Modal, ToastContainer
│   │   │   ├── invoices/         # Printable InvoiceModal, PaymentReceiptModal
│   │   │   └── quickactions/     # AddCustomerModal, RecordReadingModal, GenerateBillModal, RecordPaymentModal
│   │   ├── context/              # AuthContext, DataContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── MeterReadings.tsx
│   │   │   ├── Tariffs.tsx
│   │   │   ├── Bills.tsx
│   │   │   ├── Payments.tsx
│   │   │   ├── ReportsAnalytics.tsx
│   │   │   ├── SystemArchitecture.tsx  # OOP Showcase
│   │   │   ├── Settings.tsx
│   │   │   └── auth/             # LoginPage, OtpVerificationPage, RegisterPage, AuthSuccessPage
│   │   ├── services/             # api.ts (Backend connector with client fallback)
│   │   ├── data/                 # initialData.ts (Demo baseline)
│   │   └── types/                # index.ts (TypeScript entity contracts)
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                      # Java Spring Boot Backend
│   ├── src/main/java/com/voltflow/electricity/
│   │   ├── VoltFlowApplication.java
│   │   ├── config/               # SecurityConfig (CORS, Sessions), DataInitializer
│   │   ├── controller/           # AuthController, CustomerController, BillController, PaymentController, etc.
│   │   ├── dto/                  # RequestOtpRequest, VerifyOtpRequest, RegisterRequest, AuthResponse, etc.
│   │   ├── exception/            # GlobalExceptionHandler, InvalidReadingException, InvalidPaymentException
│   │   ├── model/                # User, OtpVerification, Customer, ResidentialCustomer, CommercialCustomer, Meter, Bill, Payment, Tariff
│   │   ├── oop_core/             # Standalone zero-dependency pure Java OOP classes & console runner for viva
│   │   ├── repository/           # Spring Data JPA repositories
│   │   └── service/              # AuthService, OtpService, EmailService, BillingService
│   ├── src/main/resources/
│   │   └── application.properties # H2 in-memory default + MySQL & SMTP settings
│   ├── pom.xml
│   └── .env.example
│
├── .env.example
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Running the Frontend (React + Vite)
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

#### Building for Production (Vercel / Netlify):
```bash
cd frontend
npm run build
```
The optimized bundle is output to `frontend/dist/`.

---

### 2. Running the Java Standalone OOP Viva Demo (Zero Setup)
You can compile and run the pure Java OOP classes directly from the terminal without needing Maven or external libraries:

```bash
cd backend/src/main/java
javac com/voltflow/electricity/oop_core/*.java
java com.voltflow.electricity.oop_core.OopVivaConsoleRunner
```

This console program demonstrates all 4 core OOP concepts with immediate terminal output.

---

### 3. Running the Spring Boot Backend (REST API + OTP Service)
The backend defaults to an **in-memory H2 database**, meaning zero database installation is required to run it immediately:

```bash
cd backend
mvn spring-boot:run
```
- REST API Base URL: `http://localhost:8080/api`
- H2 Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:voltflowdb`, User: `sa`, Password: *blank*)

---

## 🏛️ Java Object-Oriented Programming (OOP) Architecture

The core of VoltFlow models real-world electricity distribution concepts using the four fundamental pillars of Object-Oriented Programming:

### 1. Encapsulation (Data Hiding & Protection)
- **Concept:** All sensitive fields (`meterNumber`, `previousReading`, `currentReading`, `customerId`, `amount`) are declared `private`.
- **Validation Invariant:** In `Meter.java`, the method `setReadings(prev, curr)` validates that `curr >= prev`. Direct public variable mutation is forbidden.
- **Code:**
```java
public class Meter {
    private String meterNumber;
    private int previousReading;
    private int currentReading;

    public void setReadings(int previousReading, int currentReading) {
        if (currentReading < previousReading) {
            throw new InvalidReadingException("Current reading cannot be lower than previous reading!");
        }
        this.previousReading = previousReading;
        this.currentReading = currentReading;
    }
}
```

### 2. Inheritance (Code Reuse & Specialization)
- **Concept:** `ResidentialCustomer` and `CommercialCustomer` extend the abstract base class `Customer`.
- **Hierarchy:** Base properties (`customerId`, `name`, `email`, `address`, `meter`) are defined once in `Customer` and inherited by both subclasses.
- **Code:**
```java
public abstract class Customer {
    private String customerId;
    private String name;
    private Meter meter;
    // ...
    public abstract double calculateBill(int unitsConsumed);
}

public class ResidentialCustomer extends Customer {
    private double residentialTariffRate = 5.0; // ₹5/unit
    // Inherits customerId, name, meter via super()
}
```

### 3. Polymorphism (Dynamic Method Dispatch)
- **Concept:** The abstract method `double calculateBill(int unitsConsumed)` is defined in `Customer` and overridden differently in `ResidentialCustomer` and `CommercialCustomer`.
- **Runtime Resolution:** The billing engine can iterate through a heterogeneous list of customers (`List<Customer>`) and invoke `customer.calculateBill(units)`. At runtime, Java dynamically executes the appropriate tariff formula without requiring `if-else` or `switch` statements.
- **Code:**
```java
public void processAllBills(List<Customer> customers) {
    for (Customer customer : customers) {
        int units = customer.getMeter().calculateUnitsConsumed();
        // Dynamic method dispatch at runtime:
        double payable = customer.calculateBill(units);
    }
}
```

### 4. Exception Handling (Robust Validation)
- Custom exceptions (`InvalidReadingException`, `InvalidPaymentException`, `ResourceNotFoundException`) catch anomalies at runtime.
- Prevents negative bill payments, inverted meter readings, and duplicate settlements on cleared bills.

---

## 🔐 OTP Authentication Architecture

1. **Step 1:** User inputs registered email (`POST /api/auth/request-otp`).
2. **Step 2:** `OtpService` generates a 6-digit random code using `java.security.SecureRandom`.
3. **Step 3:** The code is hashed using **SHA-256** and saved in `OtpVerification`.
4. **Step 4:** `EmailService` dispatches an HTML email with the 5-minute expiry notice.
5. **Step 5:** User enters the 6-digit code in the frontend (`POST /api/auth/verify-otp`).
6. **Step 6:** Backend verifies the hash, enforces the 5-attempt limit, invalidates the code immediately (single-use), and creates an authenticated session.
7. **Step 7:** User is redirected to the dashboard.

---

## 🎓 Viva Questions & Answers Cheat Sheet

| Question | Recommended Answer |
|---|---|
| **Why did you make `Customer` an abstract class?** | Because a generic customer does not exist in the real electricity grid—every consumer is either a residential or commercial consumer with specific tariff slabs. Defining `calculateBill()` as abstract forces subclasses to supply their concrete billing formula. |
| **How does Polymorphism help in your billing engine?** | It decouples the `BillingService` from specific customer types. We can add new customer classes (e.g., `IndustrialCustomer`, `AgriculturalCustomer`) without modifying existing billing loops. |
| **How did you protect against meter reading manipulation?** | Through Encapsulation and custom exception handling. The meter's readings are private, and the mutator method validates that the current reading cannot be less than the previous reading, throwing `InvalidReadingException` otherwise. |
| **Why hash the OTP instead of storing plaintext?** | Storing plaintext OTPs is a security vulnerability. If database records are compromised, stored SHA-256 hashes cannot be reversed to reveal the plaintext verification token. |

---

## 📜 License
Developed for Academic Object-Oriented Programming (OOP) Evaluation and Demonstration.
