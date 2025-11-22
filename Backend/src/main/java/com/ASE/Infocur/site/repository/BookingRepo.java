package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.Booking;
import com.ASE.Infocur.site.entity.PhotoProgress;
import com.ASE.Infocur.site.entity.Session;
import com.ASE.Infocur.site.entity.PhotoProgress;
import com.ASE.Infocur.site.entity.Session;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.Collection;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends MongoRepository<Booking, String> {


  // Find booking by the referenced Session's sessionId
Booking findBySession_SessionId(String sessionId);

  // If Event is embedded inside Session (Session.eventId is an Event object stored inline),
  // query the nested field 'session.eventId.eventId' (the Event's id property).


  @Query("{ 'sessionId.sessionId': ?0 }")
  void deleteBySessionId(String sessionId);

  @Query("{ '_id': { $regex: ?0, $options: 'i' } }")
    Page<Booking> searchAll(String searchText,Pageable pageable);

  @Query("{ $and: [ { 'client._id': ?1 }, { $or: [ { '_id': { $regex: ?0, $options: 'i' } }, { 'status': { $regex: ?0, $options: 'i' } } ] } ] }")
  Page<Booking> searchAllByClient(String searchText, Pageable pageable, String clientId);




  Page<Booking> findBySessionIn(List<Session> sessions, Pageable pageable);

  List<Booking> findBySessionIn(List<Session> sessions);

  @Query("{ 'sessionId.sessionId': ?0 }")
  List<Booking> findAllBySessionIdForDeletion(String sessionId);



  List<Booking> findByStatus(String status);


}
