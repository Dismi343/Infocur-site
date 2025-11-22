package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface EventRepo extends MongoRepository<Event, String> {
    @Query("{ '_id': { $regex: ?0, $options: 'i' } }")
    Page<Event> searchAll(String searchText, Pageable pageable);


}
