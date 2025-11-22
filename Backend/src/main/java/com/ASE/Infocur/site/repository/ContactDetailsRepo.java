package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.ContactDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactDetailsRepo extends MongoRepository<ContactDetails, String> {
    @Query("{ '_id': { $regex: ?0, $options: 'i' } }")
    Page<ContactDetails> searchAll(String searchText, Pageable pageable);

    public long count();
}

