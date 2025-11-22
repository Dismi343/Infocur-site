package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.RequestEventDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateEventDto;
import com.ASE.Infocur.site.dto.response.response.ResponseEventDto;
import com.ASE.Infocur.site.entity.*;
import com.ASE.Infocur.site.exception.EntryNotFoundException;
import com.ASE.Infocur.site.repository.*;
import com.ASE.Infocur.site.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepo eventRepo;
    private final PackageRepo packageRepo;
    private final SessionRepo sessionRepo;
    private final BookingRepo bookingRepo;
    private final PhotoProgressRepo photoProgressRepo;


    @Override
    public void save(RequestEventDto dto) {

       Event savedEvent= eventRepo.save(toEvent(dto));

        if(dto.getIndoor().getSessionCount()>0){
            generateTimeSlotsForEvent(
                    savedEvent.getEventId(),
                    "Indoor",
                    dto.getIndoor().getSessionCount(),
                    dto.getIndoor().getSessionDuration(),
                    dto.getIndoor().getInterval(),
                    dto.getStartTime()
            );
        }
        if(dto.getOutdoor().getSessionCount()>0){
            generateTimeSlotsForEvent(
                    savedEvent.getEventId(),
                    "Outdoor",
                    dto.getOutdoor().getSessionCount(),
                    dto.getOutdoor().getSessionDuration(),
                    dto.getOutdoor().getInterval(),
                    dto.getStartTime()
            );
        }

    }

        private Event toEvent(RequestEventDto dto){
        if(dto==null) return null;
        List<ClientPackage> indoorPkg = dto.getIndoorPackageInfo().stream()
    .map(id -> packageRepo.findById(id).orElse(null))
    .filter(Objects::nonNull)
    .toList();
        List<ClientPackage> outdoorPkg = dto.getOutdoorPackageInfo().stream()
                    .map(id -> packageRepo.findById(id).orElse(null))
                    .filter(Objects::nonNull)
                    .toList();



        return Event.builder()
                .eventId(UUID.randomUUID().toString())
                .eventName(dto.getEventName())
                .indoorPackageInfo(indoorPkg)
                .outdoorPackageInfo(outdoorPkg)
                .indoor(dto.getIndoor())
                .outdoor(dto.getOutdoor())
                .startTime(dto.getStartTime())
                .date(dto.getDate())
                .build();
        }
    @Override
    public void delete(String id) {

        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        //==========================================================================================
        //==========================================================================================

//        List<Booking> bookings = bookingRepo.findByEventId(id);
//        if (!bookings.isEmpty()) {
//            bookingRepo.deleteAll(bookings);
//        }

        //==========================================================================================
        //==========================================================================================



        List<Session> sessions = sessionRepo.findByEventId(id);
            // Step 2: Delete all bookings linked to session
            List<Booking> bookings = bookingRepo.findBySessionIn(sessions);

        for (Booking booking : bookings) {
            photoProgressRepo.findByBooking_BookingId(booking.getBookingId())
                    .ifPresent(photoProgressRepo::delete);
        }

            bookingRepo.deleteAll(bookings);





        //==========================================================================================
        //==========================================================================================

        if (event.getIndoorPackageInfo() != null) {
            List<String> packageIdsIndoor = event.getIndoorPackageInfo()
                    .stream()
                    .map(ClientPackage::getPackageId)  // extract ID
                    .toList();

            packageRepo.deleteAllById(packageIdsIndoor);
        }
        if (event.getIndoorPackageInfo() != null) {
            List<String> packageIdsOutdoor = event.getOutdoorPackageInfo()
                    .stream()
                    .map(ClientPackage::getPackageId)  // extract ID
                    .toList();

            packageRepo.deleteAllById(packageIdsOutdoor);
        }

        //==========================================================================================
        //==========================================================================================


        if (!sessions.isEmpty()) {
            sessionRepo.deleteAll(sessions);
        }

        //==========================================================================================
        // Deleting all time slots related to the event
        //==========================================================================================

        List<Session> timeSlots= sessionRepo.findByEventIdEventId(id);

        if(!timeSlots.isEmpty()){
            sessionRepo.deleteAll(timeSlots);
        }

        //==========================================================================================
        //==========================================================================================

        eventRepo.deleteById(id);
    }

    @Override
    public ResponseEventDto findById(String id) {
        return toResponseEventData(eventRepo.findById(id).orElseThrow(()->new EntryNotFoundException("NO Event Found")));
    }


    private ResponseEventDto toResponseEventData(Event event){
        if(event==null) return null;
        return ResponseEventDto.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .indoorPackageInfo(event.getIndoorPackageInfo())
                .outdoorPackageInfo(event.getOutdoorPackageInfo())
                .indoor(event.isIndoor() ? event.getIndoor() : null)
                .outdoor(event.isOutdoor() ? event.getOutdoor() : null)
                .startTime(event.getStartTime())
                .date(event.getDate())
                .build();
    }


    @Override
    public void updateById(RequestEventDto dto, String id) {

        //==========================================================================================
        // Deleting all time slots related to the event
        //==========================================================================================

        List<Session> timeSlots= sessionRepo.findByEventIdEventId(id);

        if(!timeSlots.isEmpty()){
            sessionRepo.deleteAll(timeSlots);
        }
        List<Booking> bookings = bookingRepo.findBySessionIn(timeSlots);
        bookingRepo.deleteAll(bookings);

        //==========================================================================================
        //==========================================================================================


        Event event=eventRepo.findById(id).orElseThrow(()->new EntryNotFoundException("NO Event Found"));
        event.setEventName(dto.getEventName());
        event.setIndoorPackageInfo(
                dto.getIndoorPackageInfo().stream()
                        .map(pkgId -> packageRepo.findById(pkgId).orElseThrow(() -> new EntryNotFoundException("Package not found: " + pkgId)))
                        .toList()
        );
        event.setOutdoorPackageInfo(
                dto.getOutdoorPackageInfo().stream()
                        .map(pkgId -> packageRepo.findById(pkgId).orElseThrow(() -> new EntryNotFoundException("Package not found: " + pkgId)))
                        .toList()
        );
        event.setIndoor(dto.getIndoor());
        event.setOutdoor(dto.getOutdoor());
        event.setStartTime(dto.getStartTime());
        event.setDate(dto.getDate());

       Event savedEvent= eventRepo.save(event);



        //==========================================================================================


        if(dto.getIndoor().getSessionCount()>0){
            generateTimeSlotsForEvent(
                    savedEvent.getEventId(),
                    "Indoor",
                    dto.getIndoor().getSessionCount(),
                    dto.getIndoor().getSessionDuration(),
                    dto.getIndoor().getInterval(),
                    dto.getStartTime()
            );
        }
        if(dto.getOutdoor().getSessionCount()>0){
            generateTimeSlotsForEvent(
                    savedEvent.getEventId(),
                    "Outdoor",
                    dto.getOutdoor().getSessionCount(),
                    dto.getOutdoor().getSessionDuration(),
                    dto.getOutdoor().getInterval(),
                    dto.getStartTime()
            );
        }



        //==========================================================================================
    }

    @Override
    public PaginateEventDto searchAll(String searchText, int page, int size) {
        Page<Event> eventList=eventRepo.searchAll(searchText, PageRequest.of(page, size));

        return PaginateEventDto.builder()
                .dataList(
                        eventList.stream().map(e->toResponseEventData(e)).toList()
                ).count(eventList.getTotalElements())
                .build();
    }


    //==========================================================================================
    //Generating time slots for a given event
    //==========================================================================================

    private void generateTimeSlotsForEvent(String event, String sessionType,int sessionCount, int sessionDuration, int interval, LocalTime startTime){
        LocalTime currentStart = startTime;

        for (int i = 0; i < sessionCount; i++) {
            LocalTime currentEnd = currentStart.plusMinutes(sessionDuration);

            Session slot = new Session();
            slot.setSessionId(UUID.randomUUID().toString());
            slot.setSlotNumber(i + 1);
            slot.setStartTime(currentStart);
            slot.setEndTime(currentEnd);
            slot.setSessionType(sessionType);
            slot.setEventId(eventRepo.findById(event).orElseThrow(() -> new EntryNotFoundException("No Event found")));
            slot.setAvailable(true);

            sessionRepo.save(slot);

            currentStart = currentEnd.plusMinutes(interval);

        }

    }

    public List<Session> getAvailableSlots(String event){
        return sessionRepo.findByEventIdEventId(event);
    }



//    private TimeSlots toResponseTimeSlots( String event,int slotNumber,LocalTime currentStart,LocalTime currentEnd,String sessionType ){
//        return TimeSlots.builder()
//                .slotNumber(slotNumber)
//                .startTime(currentStart)
//                .endTime(currentEnd)
//                .sessionType(sessionType)
//                .event(eventRepo.findById(event).orElse(null))
//                .isAvailable(true)
//                .build();
//    }

}
