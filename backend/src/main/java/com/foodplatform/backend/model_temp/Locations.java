package com.foodplatform.backend.model_temp;


import org.springframework.stereotype.Component;

@Component
public class Locations {


    public Locations(String address, Coordinates coordinates) {
        this.address = address;
        this.coordinates = coordinates;
    }

    private String address;
    private Coordinates coordinates;

    public Locations(){}

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Coordinates coordinates) {
        this.coordinates = coordinates;
    }

    @Override
    public String toString() {
        return "Location{" +
                "address='" + address + '\'' +
                ", coordinates=" + coordinates +
                '}';
    }

}
