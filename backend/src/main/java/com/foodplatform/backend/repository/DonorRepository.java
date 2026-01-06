package com.foodplatform.backend.repository;

import com.foodplatform.backend.model_temp.Donor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonorRepository extends MongoRepository<Donor,String> {
}
