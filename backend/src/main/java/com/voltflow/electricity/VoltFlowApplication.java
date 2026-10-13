package com.voltflow.electricity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VoltFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(VoltFlowApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  ⚡ VoltFlow Electricity Bill Management System is ONLINE!       ");
        System.out.println("  ⚡ Backend REST API: http://localhost:8080/api                   ");
        System.out.println("  ⚡ H2 Console:       http://localhost:8080/h2-console            ");
        System.out.println("==================================================================");
    }
}
