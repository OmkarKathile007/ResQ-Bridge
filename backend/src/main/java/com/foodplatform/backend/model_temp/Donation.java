package com.foodplatform.backend.model_temp;


import org.springframework.stereotype.Component;

@Component
public class Donation {
    private String foodFor;
    private String foodType;
    private String quantity;
    private FoodImage foodImage;

    public Donation(String foodFor, String foodType, String quantity, FoodImage foodImage) {
        this.foodFor = foodFor;
        this.foodType = foodType;
        this.quantity = quantity;
        this.foodImage = foodImage;
    }
    public Donation(){}

    public void setFoodFor(String foodFor) {
        this.foodFor=foodFor;
    }

    public void setFoodType(String foodType) {
        this.foodType=foodType;
    }

    public void setQuantity(String quantity) {
        this.quantity=quantity;
    }

    public void setFoodImage(FoodImage foodImage) {
        this.foodImage=foodImage;
    }

    public String getFoodFor() {
        return foodFor;
    }

    public String getFoodType() {
        return foodType;
    }

    public String getQuantity() {
        return quantity;
    }

    public FoodImage getFoodImage() {
        return foodImage;
    }

    @Override
    public String toString() {
        return "Donation{" +
                "foodFor='" + foodFor + '\'' +
                ", foodType='" + foodType + '\'' +
                ", quantity='" + quantity + '\'' +
                ", foodImage=" + foodImage +
                '}';
    }

}