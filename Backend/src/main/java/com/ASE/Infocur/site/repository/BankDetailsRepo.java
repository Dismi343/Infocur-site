package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.BankDetails;
import com.ASE.Infocur.site.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BankDetailsRepo extends MongoRepository<BankDetails, String> {
    @Query("{ '_id': { $regex: ?0, $options: 'i' } }")
    Page<BankDetails> searchAll(String searchText, Pageable pageable);

    public long count();
}
