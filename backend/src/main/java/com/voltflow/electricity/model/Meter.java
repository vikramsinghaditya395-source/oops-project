package com.voltflow.electricity.model;

import com.voltflow.electricity.exception.InvalidReadingException;
import jakarta.persistence.*;

@Entity
@Table(name = "meters")
public class Meter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String meterNumber;

    @Column(nullable = false)
    private int previousReading;

    @Column(nullable = false)
    private int currentReading;

    private String readingDate;
    private String status; // "Verified", "Pending"

    public Meter() {}

    public Meter(String meterNumber, int previousReading, int currentReading) {
        this.meterNumber = meterNumber;
        setReadings(previousReading, currentReading);
        this.status = "Verified";
    }

    /**
     * Encapsulated domain logic:
     * Validates that current reading cannot be less than previous reading.
     */
    public void setReadings(int previousReading, int currentReading) {
        if (currentReading < previousReading) {
            throw new InvalidReadingException(
                "Current meter reading (" + currentReading + " kWh) cannot be lower than previous reading (" + previousReading + " kWh)."
            );
        }
        this.previousReading = previousReading;
        this.currentReading = currentReading;
    }

    /**
     * OOP Method:
     * Automatically computes delta units consumed: Current - Previous
     */
    public int calculateUnitsConsumed() {
        if (currentReading < previousReading) {
            throw new InvalidReadingException("Inverted meter readings detected!");
        }
        return currentReading - previousReading;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }

    public int getPreviousReading() { return previousReading; }
    public void setPreviousReading(int previousReading) { this.previousReading = previousReading; }

    public int getCurrentReading() { return currentReading; }
    public void setCurrentReading(int currentReading) { this.currentReading = currentReading; }

    public String getReadingDate() { return readingDate; }
    public void setReadingDate(String readingDate) { this.readingDate = readingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
