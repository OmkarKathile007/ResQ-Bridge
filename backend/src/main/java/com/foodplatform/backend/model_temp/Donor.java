package com.foodplatform.backend.model_temp;

import org.springframework.stereotype.Component;


import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Component
@Document(collection = "donors")
public class Donor {
    @Id
    private String id;

    private String donorName;
    private String contactNumber;
    private String donorType;
    private Donation donation;
    private Locations location;

    @CreatedDate
    private Date createdAt;

    public void setDonorName(String donorName) {
        this.donorName=donorName;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber=contactNumber;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDonorName() {
        return donorName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getDonorType() {
        return donorType;
    }

    public void setDonorType(String donorType) {
        this.donorType = donorType;
    }

    public Donation getDonation() {
        return donation;
    }

    public void setDonation(Donation donation) {
        this.donation = donation;
    }

    public Locations getLocation() {
        return location;
    }

    public void setLocation(Locations location) {
        this.location = location;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Donor(String id, String donorName, String contactNumber, String donorType, Donation donation, Locations location, Date createdAt) {
        this.id = id;
        this.donorName = donorName;
        this.contactNumber = contactNumber;
        this.donorType = donorType;
        this.donation = donation;
        this.location = location;
        this.createdAt = createdAt;
    }
    public Donor(){}

    @Override
    public String toString() {
        return "Donor{" +
                "id='" + id + '\'' +
                ", donorName='" + donorName + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", donorType='" + donorType + '\'' +
                ", donation=" + donation +
                ", location=" + location +
                ", createdAt=" + createdAt +
                '}';
    }


}
