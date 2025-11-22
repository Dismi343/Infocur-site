package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.ClientPackage;
import com.ASE.Infocur.site.entity.PhotoProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoProgressRepo extends MongoRepository<PhotoProgress, String> {

    @Query("{ 'id': { $regex: ?0, $options: 'i' } }")
    Page<PhotoProgress> searchAll(String searchText, Pageable pageable);

     Optional<PhotoProgress> findByBooking_BookingId(String bookingId);
;

    void deleteByBooking_BookingId(String bookingId);

    Page<PhotoProgress> findByBooking_BookingId(String bookingId, Pageable pageable);

    @Query("{ 'event.$id': ?0, 'booking.$id': { $in: ?1 } }")
    Page<PhotoProgress> findByEventId(String eventId,List<String> bookingIds, Pageable pageable);

    @Query("{ 'event.$id': ?0, 'booking.$id': { $in: ?1 } }")
    PhotoProgress findByEventId(String eventId);

    public long count();

}
