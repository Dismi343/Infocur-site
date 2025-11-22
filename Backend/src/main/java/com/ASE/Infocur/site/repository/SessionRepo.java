package com.ASE.Infocur.site.repository;


import com.ASE.Infocur.site.entity.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepo extends MongoRepository<Session, String> {

   //Session findByTime(String timeSlot, String session_type);

 Session findBySessionId(String sessionId);

    @Query(value= "{sessionId: '?0'}", fields = "{'name': 1, 'quantity': 1}")
    List<Session> findAll(String session_id);

    @Query("{ '_id': { $regex: ?0, $options: 'i' } }")
    Page<Session> searchAll(String searchText, Pageable pageable);

    public long count();

   @Query("{ 'eventId.eventId': ?0 }")
   List<Session> findByEventId(String eventId);


   void deleteByEventId_EventId(String eventId);

    List<Session>  findByEventIdEventId(String eventId);


}
