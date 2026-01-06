package com.foodplatform.backend.controller;

import com.foodplatform.backend.model_temp.Donor;
import com.foodplatform.backend.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class NgoController {

    @Autowired
    private DonorRepository donorRepository;

    private static final DateTimeFormatter ISO_FMT =
            DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC);

    @GetMapping("/donors")
    public ResponseEntity<List<Map<String, Object>>> getAllDonors() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Current User: " + auth.getName());
        System.out.println("Authorities: " + auth.getAuthorities());
        List<Donor> donors = donorRepository.findAll();
        List<Map<String, Object>> processed = donors.stream()
                .map(this::toResponseMap)
                .collect(Collectors.toList());

        return ResponseEntity.ok(processed);
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
}
