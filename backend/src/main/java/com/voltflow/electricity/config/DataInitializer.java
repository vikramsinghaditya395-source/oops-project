package com.voltflow.electricity.config;

import com.voltflow.electricity.model.*;
import com.voltflow.electricity.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final MeterRepository meterRepository;
    private final TariffRepository tariffRepository;
    private final BillRepository billRepository;
    private final PaymentRepository paymentRepository;

    public DataInitializer(UserRepository userRepository,
                           CustomerRepository customerRepository,
                           MeterRepository meterRepository,
                           TariffRepository tariffRepository,
                           BillRepository billRepository,
                           PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.meterRepository = meterRepository;
        this.tariffRepository = tariffRepository;
        this.billRepository = billRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void run(String... args) {
        // Preload Tariffs
        if (tariffRepository.count() == 0) {
            tariffRepository.save(new Tariff(
                "Residential", 5.0, 50.0, 4.0, "2026-01-01", 
                "Standard domestic household tariff schedule"
            ));
            tariffRepository.save(new Tariff(
                "Commercial", 8.0, 50.0, 6.0, "2026-01-01", 
                "Commercial non-domestic enterprise tariff schedule"
            ));
        }

        // Preload Default Users
        if (userRepository.count() == 0) {
            User admin = new User("Aditya (Admin)", "admin@voltflow.com", "ADMIN", true);
            userRepository.save(admin);

            User customer = new User("Aditya Sharma", "aditya.sharma@example.com", "CUSTOMER", true);
            customer.setCustomerType("Residential");
            customer.setMeterNumber("MTR-8801");
            userRepository.save(customer);
        }

        // Preload Meters
        if (meterRepository.count() == 0) {
            meterRepository.save(new Meter("MTR-8801", 1240, 1520));
            meterRepository.save(new Meter("MTR-9901", 18450, 21950));
            meterRepository.save(new Meter("MTR-8802", 3200, 3410));
        }

        // Preload Sample Customers
        if (customerRepository.count() == 0) {
            ResidentialCustomer res1 = new ResidentialCustomer(
                "VF-RES-1001", "Aditya Sharma", "aditya.sharma@example.com",
                "+91 98765 43210", "42 Orchid Heights, Sector 14, Gurugram",
                "MTR-8801", "2023-01-15"
            );
            customerRepository.save(res1);

            CommercialCustomer com1 = new CommercialCustomer(
                "VF-COM-2001", "CyberTech Innovations Ltd", "billing@cybertech.example.com",
                "+91 98111 22334", "Plot 78, Cyber City Phase 2, Gurugram",
                "MTR-9901", "2022-06-20"
            );
            customerRepository.save(com1);

            ResidentialCustomer res2 = new ResidentialCustomer(
                "VF-RES-1002", "Priya Mukherjee", "priya.m@example.com",
                "+91 97654 32109", "B-104, Green Glen Meadows, Bengaluru",
                "MTR-8802", "2023-03-10"
            );
            customerRepository.save(res2);
        }
    }
}
