package com.foodplatform.backend.model_temp;


import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class FoodImage {
    private byte[] image;     // stored as binary
    private String contentType;



    public void setImage(byte[] bytes) {
        this.image=bytes;
    }

    public void setContentType(String contentType) {
        this.contentType=contentType;
    }

    public byte[] getImage() {
        return image;
    }

    public String getContentType() {
        return contentType;
    }

    public FoodImage(byte[] image, String contentType) {
        this.image = image;
        this.contentType = contentType;
    }

    public FoodImage(){}

    @Override
    public String toString() {
        return "FoodImage{" +
                "image=" + Arrays.toString(image) +
                ", contentType='" + contentType + '\'' +
                '}';
    }


}