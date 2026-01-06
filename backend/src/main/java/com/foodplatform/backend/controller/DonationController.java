package com.foodplatform.backend.controller;

//
//import com.foodplatform.backend.Model.*;
//import com.foodplatform.backend.repository.DonorRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MaxUploadSizeExceededException;
//import org.springframework.web.multipart.MultipartFile;
//
////import javax.xml.stream.Location;
//import com.foodplatform.backend.Model.Locations;
//
//import javax.xml.stream.Location;
//import java.time.Instant;
//import java.time.ZoneOffset;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//import java.util.*;
//
//
//
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "*")
//public class DonationController {
//
//    @Autowired
//    private DonorRepository donorRepository;
//
//    private static final DateTimeFormatter ISO_FMT =
//            DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC);
//
//    @GetMapping("/donors")
//    public ResponseEntity<List<Map<String, Object>>> getAllDonors() {
//        List<Donor> donors = donorRepository.findAll();
//        List<Map<String, Object>> processed = donors.stream()
//                .map(this::toResponseMap)
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(processed);
//    }
//
//    @PostMapping(path = "/donations", consumes = {"multipart/form-data"})
//    public ResponseEntity<?> createDonation(
//            @RequestParam Map<String, String> body,
//            @RequestPart(value = "foodImage", required = false) MultipartFile file
//    ) {
//        // Validate required fields
//        String[] required = {"donorName", "contactNumber", "donorType", "foodFor", "address", "latitude", "longitude"};
//        for (String f : required) {
//            if (!body.containsKey(f) || body.get(f).isBlank()) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body(Map.of("error", f + " is required"));
//            }
//        }
//
//        // Process image (if provided)
//        FoodImage foodImage = null;
//        try {
//            if (file != null && !file.isEmpty()) {
//                if (file.getSize() > 5L * 1024L * 1024L) {
//                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                            .body(Map.of("error", "File too large. Max 5MB allowed."));
//                }
//                foodImage = new FoodImage();
//                try {
//                    foodImage.setImage(file.getBytes());
//                } catch (Exception ex) {
//                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                            .body(Map.of("error", "Failed to read uploaded file."));
//                }
//                foodImage.setContentType(file.getContentType());
//            }
//        } catch (MaxUploadSizeExceededException ex) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("error", "File too large. Max 5MB allowed."));
//        }
//
//        // Build Donation
//        String foodFor = body.get("foodFor");
//        String foodType = "Not applicable";
//        String quantity = "Not applicable";
//        if ("humans".equalsIgnoreCase(foodFor)) {
//            foodType = body.getOrDefault("foodType", "Not specified");
//            quantity = body.getOrDefault("quantity", "Not specified");
//        }
//
//        Donation donation = new Donation();
//        donation.setFoodFor(foodFor);
//        donation.setFoodType(foodType);
//        donation.setQuantity(quantity);
//        donation.setFoodImage(foodImage);
//
//        // Build Location
//        Coordinates coords = new Coordinates();
//        coords.setLatitude(Double.parseDouble(body.get("latitude")));
//        coords.setLongitude(Double.parseDouble(body.get("longitude")));
//
//        Locations location = new Locations();
//        location.setAddress(body.get("address"));
//        location.setCoordinates(coords);
//
//        Donor donor = new Donor();
//        donor.setDonorName(body.get("donorName"));
//        donor.setContactNumber(body.get("contactNumber"));
//        donor.setDonorType(body.get("donorType"));
//        donor.setDonation(donation);
//        donor.setLocation((Locations) location);
//
//        Donor saved = donorRepository.save(donor);
//
//        // convert saved to response format (base64 image)
//        Map<String, Object> resp = toResponseMap(saved);
//        donor.setDonorName(body.getOrDefault("donorName", "Unknown"));
//        donor.setContactNumber(body.getOrDefault("contactNumber", "Not Provided"));
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
//    }
//
//    private Map<String, Object> toResponseMap(Donor donor) {
//        Map<String, Object> map = new HashMap<>();
//        map.put("_id", donor.getId());
//        map.put("donorName", donor.getDonorName());
//        map.put("contactNumber", donor.getContactNumber());
//        map.put("donorType", donor.getDonorType());
//
//        // donation
//        Map<String, Object> donationMap = new HashMap<>();
//        if (donor.getDonation() != null) {
//            donationMap.put("foodFor", donor.getDonation().getFoodFor());
//            donationMap.put("foodType", donor.getDonation().getFoodType());
//            donationMap.put("quantity", donor.getDonation().getQuantity());
//
//            if (donor.getDonation().getFoodImage() != null && donor.getDonation().getFoodImage().getImage() != null) {
//                String base64 = Base64.getEncoder().encodeToString(donor.getDonation().getFoodImage().getImage());
//                Map<String, Object> img = Map.of(
//                        "image", base64,
//                        "contentType", donor.getDonation().getFoodImage().getContentType()
//                );
//                donationMap.put("foodImage", img);
//            } else {
//                donationMap.put("foodImage", null);
//            }
//        }
//        map.put("donation", donationMap);
//
//        // location
//        if (donor.getLocation() != null) {
//            Map<String, Object> loc = new HashMap<>();
//            loc.put("address", donor.getLocation().getClass());
//            if (donor.getLocation().getClass() != null) {
//                Map<String, Object> coords = new HashMap<>();
//                coords.put("latitude", donor.getLocation().getLineNumber());
//                coords.put("longitude", donor.getLocation().getClass().getModule());
//                loc.put("coordinates", coords);
//            }
//            map.put("location", loc);
//        }
//
//        if (donor.getCreatedAt() != null) {
//            map.put("createdAt", ISO_FMT.format(donor.getCreatedAt().toInstant()));
//        } else {
//            map.put("createdAt", Instant.now().toString());
//        }
//
//        return map;
//    }
//
//    // Optional: handle file-too-large exceptions
//    @ExceptionHandler(MaxUploadSizeExceededException.class)
//    public ResponseEntity<?> handleMaxSize(MaxUploadSizeExceededException exc) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "File too large. Max 5MB allowed."));
//    }
//}
//


//package com.foodplatform.backend.controller;

import com.foodplatform.backend.model_temp.Donor;
import com.foodplatform.backend.model_temp.FoodImage;
import com.foodplatform.backend.model_temp.Locations;
import com.foodplatform.backend.model_temp.Donation;
import com.foodplatform.backend.model_temp.Coordinates;
import com.foodplatform.backend.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DonationController {

    @Autowired
    private DonorRepository donorRepository;

    private static final DateTimeFormatter ISO_FMT =
            DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC);

//    @GetMapping("/donors")
//    public ResponseEntity<List<Map<String, Object>>> getAllDonors() {
//        List<Donor> donors = donorRepository.findAll();
//        List<Map<String, Object>> processed = donors.stream()
//                .map(this::toResponseMap)
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(processed);
//    }

//    @PostMapping(path = "/donations", consumes = {"multipart/form-data"})
//    public ResponseEntity<?> createDonation(
//            @RequestParam Map<String, String> body,
//            @RequestPart(value = "foodImage", required = false) MultipartFile file
//    ) {
//        // Validate required fields
//        String[] required = {"donorName", "contactNumber", "donorType", "foodFor", "address", "latitude", "longitude"};
//        for (String f : required) {
//            if (!body.containsKey(f) || body.get(f).isBlank()) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body(Map.of("error", f + " is required"));
//            }
//        }
//
//        // Process image (if provided)
//        FoodImage foodImage = null;
//        try {
//            if (file != null && !file.isEmpty()) {
//                if (file.getSize() > 5L * 1024L * 1024L) {
//                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                            .body(Map.of("error", "File too large. Max 5MB allowed."));
//                }
//                foodImage = new FoodImage();
//                foodImage.setImage(file.getBytes());
//                foodImage.setContentType(file.getContentType());
//            }
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "Failed to read uploaded file."));
//        }
//
//        // Build Donation
//        String foodFor = body.get("foodFor");
//        String foodType = "Not applicable";
//        String quantity = "Not applicable";
//        if ("humans".equalsIgnoreCase(foodFor)) {
//            foodType = body.getOrDefault("foodType", "Not specified");
//            quantity = body.getOrDefault("quantity", "Not specified");
//        }
//
//        Donation donation = new Donation();
//        donation.setFoodFor(foodFor);
//        donation.setFoodType(foodType);
//        donation.setQuantity(quantity);
//        donation.setFoodImage(foodImage);
//
//        // Build Location
//        Coordinates coords = new Coordinates();
//        coords.setLatitude(Double.parseDouble(body.get("latitude")));
//        coords.setLongitude(Double.parseDouble(body.get("longitude")));
//
//        Locations location = new Locations();
//        location.setAddress(body.get("address"));
//        location.setCoordinates(coords);
//
//        // Build Donor
//        Donor donor = new Donor();
//        donor.setDonorName(body.get("donorName"));
//        donor.setContactNumber(body.get("contactNumber"));
//        donor.setDonorType(body.get("donorType"));
//        donor.setDonation(donation);
//        donor.setLocation(location);
//        donor.setCreatedAt(new Date());
//
//        Donor saved = donorRepository.save(donor);
//
//        // convert saved to response format (base64 image)
//        Map<String, Object> resp = toResponseMap(saved);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
//    }

    @PostMapping(path = "/donations", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createDonation(
            @RequestParam Map<String, String> body,
            @RequestPart(value = "foodImage", required = false) MultipartFile file
    ) {
        try {
            // 1. Validation
            String[] required = {"donorName", "contactNumber", "donorType", "foodFor", "address", "latitude", "longitude"};
            for (String f : required) {
                if (!body.containsKey(f) || body.get(f).isBlank()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", f + " is required"));
                }
            }

            // 2. Process Image
            FoodImage foodImage = null;
            if (file != null && !file.isEmpty()) {
                if (file.getSize() > 5L * 1024L * 1024L) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "File too large. Max 5MB allowed."));
                }
                foodImage = new FoodImage();
                foodImage.setImage(file.getBytes());
                foodImage.setContentType(file.getContentType());
            }

            // 3. Build Donation Object
            String foodFor = body.get("foodFor");
            String foodType = "Not applicable";
            String quantity = "Not applicable";
            if ("humans".equalsIgnoreCase(foodFor)) {
                foodType = body.getOrDefault("foodType", "Not specified");
                quantity = body.getOrDefault("quantity", "Not specified");
            }

            Donation donation = new Donation();
            donation.setFoodFor(foodFor);
            donation.setFoodType(foodType);
            donation.setQuantity(quantity);
            donation.setFoodImage(foodImage);

            // 4. Build Location
            Coordinates coords = new Coordinates();
            coords.setLatitude(Double.parseDouble(body.get("latitude")));
            coords.setLongitude(Double.parseDouble(body.get("longitude")));

            Locations location = new Locations();
            location.setAddress(body.get("address"));
            location.setCoordinates(coords);

            // 5. Build Donor
            Donor donor = new Donor();
            donor.setDonorName(body.get("donorName"));
            donor.setContactNumber(body.get("contactNumber"));
            donor.setDonorType(body.get("donorType"));
            donor.setDonation(donation);
            donor.setLocation(location);
            // Ensure createdAt is set if your DB doesn't do it automatically
            donor.setCreatedAt(new Date());

            Donor saved = donorRepository.save(donor);

            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseMap(saved));

        } catch (Exception e) {
            e.printStackTrace(); // Print error to console for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server Error: " + e.getMessage()));
        }
    }

    private Map<String, Object> toResponseMap(Donor donor) {
        Map<String, Object> map = new HashMap<>();
        map.put("_id", donor.getId());
        map.put("donorName", donor.getDonorName());
        map.put("contactNumber", donor.getContactNumber());
        map.put("donorType", donor.getDonorType());

        // donation
        Map<String, Object> donationMap = new HashMap<>();
        if (donor.getDonation() != null) {
            donationMap.put("foodFor", donor.getDonation().getFoodFor());
            donationMap.put("foodType", donor.getDonation().getFoodType());
            donationMap.put("quantity", donor.getDonation().getQuantity());

            if (donor.getDonation().getFoodImage() != null && donor.getDonation().getFoodImage().getImage() != null) {
                String base64 = Base64.getEncoder().encodeToString(donor.getDonation().getFoodImage().getImage());
                Map<String, Object> img = Map.of(
                        "image", base64,
                        "contentType", donor.getDonation().getFoodImage().getContentType()
                );
                donationMap.put("foodImage", img);
            } else {
                donationMap.put("foodImage", null);
            }
        }
        map.put("donation", donationMap);

        // location
        if (donor.getLocation() != null) {
            Map<String, Object> loc = new HashMap<>();
            loc.put("address", donor.getLocation().getAddress());
            if (donor.getLocation().getCoordinates() != null) {
                Map<String, Object> coords = new HashMap<>();
                coords.put("latitude", donor.getLocation().getCoordinates().getLatitude());
                coords.put("longitude", donor.getLocation().getCoordinates().getLongitude());
                loc.put("coordinates", coords);
            }
            map.put("location", loc);
        }

        if (donor.getCreatedAt() != null) {
            map.put("createdAt", ISO_FMT.format(donor.getCreatedAt().toInstant()));
        } else {
            map.put("createdAt", Instant.now().toString());
        }

        return map;
    }

    // Optional: handle file-too-large exceptions
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleMaxSize(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "File too large. Max 5MB allowed."));
    }
}
