package com.voltflow.electricity.oop_core;

public class Meter {
    private String meterNumber;
    private int previousReading;
    private int currentReading;

    public Meter(String meterNumber, int previousReading, int currentReading) {
        this.meterNumber = meterNumber;
        setReadings(previousReading, currentReading);
    }

    public void setReadings(int previousReading, int currentReading) {
        if (currentReading < previousReading) {
            throw new IllegalArgumentException(
                "Invalid Reading: Current reading (" + currentReading + " kWh) cannot be lower than previous reading (" + previousReading + " kWh)."
            );
        }
        this.previousReading = previousReading;
        this.currentReading = currentReading;
    }

    /**
     * Calculates net electricity consumed: Current - Previous
     */
    public int calculateUnitsConsumed() {
        return currentReading - previousReading;
    }

    public String getMeterNumber() { return meterNumber; }
    public int getPreviousReading() { return previousReading; }
    public int getCurrentReading() { return currentReading; }
}
