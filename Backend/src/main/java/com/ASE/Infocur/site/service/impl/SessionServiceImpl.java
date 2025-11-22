package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.RequestSessionDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateSessionDto;
import com.ASE.Infocur.site.dto.response.response.ResponseSessionDto;
import com.ASE.Infocur.site.entity.Event;
import com.ASE.Infocur.site.entity.Session;
import com.ASE.Infocur.site.exception.EntryNotFoundException;
import com.ASE.Infocur.site.repository.BookingRepo;
import com.ASE.Infocur.site.repository.EventRepo;
import com.ASE.Infocur.site.repository.SessionRepo;
import com.ASE.Infocur.site.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {
    private final SessionRepo sessionRepo;
    private final EventRepo eventRepo;
    private final BookingRepo bookingRepo;

    @Override
    public void save(RequestSessionDto requestSessionDto) {

        try {

            //TimeSlots timeSlots= timeSlotsRepo.findById(requestSessionDto.getTimeSlot()).orElseThrow(() -> new EntryNotFoundException("Time slot not found"));

            sessionRepo.save(toSession(requestSessionDto));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid slot number: " + e.getMessage());
        }


    }

    private Session toSession(RequestSessionDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("RequestSessionDto cannot be null");
        }

        Event event = eventRepo.findById(dto.getEventId())
                .orElseThrow(() -> new EntryNotFoundException("Event not found"));

       // TimeSlots timeSlots=timeSlotsRepo.findById(dto.getTimeSlot()).orElseThrow(() -> new EntryNotFoundException("Event not found"));

        if ("outdoor".equals(dto.getSessionType())) {
            if (event.getOutdoor() == null || event.getOutdoor().getSessionCount() <= 0) {
                throw new IllegalArgumentException("No outdoor slots available for this event");
            }else if(dto.getSlotNumber()>event.getOutdoor().getSessionCount()) {
                throw new IllegalArgumentException("slotNumber exceeds available outdoor slots for this event");
            }
        } else if ("indoor".equals(dto.getSessionType())) {
            if (event.getIndoor() == null || event.getIndoor().getSessionCount() <= 0) {
                throw new IllegalArgumentException("No indoor slots available for this event");
            }
            else if (dto.getSlotNumber()>event.getIndoor().getSessionCount()) {
                throw new IllegalArgumentException("slotNumber exceeds available indoor slots for this event");
            }
        } else {
            throw new IllegalArgumentException("Invalid session type. Must be 'indoor' or 'outdoor'");
        }
        if (dto.getSlotNumber() <= 0) {
            throw new IllegalArgumentException("Slot number must be greater than 0");
        }

        return Session.builder()
                .sessionId(UUID.randomUUID().toString())
                .eventId(event)
                .slotNumber(dto.getSlotNumber())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .sessionType(dto.getSessionType())
                .available(dto.isAvailable())
                .build();
    }

    @Override
    public void delete(String session_id) {

        sessionRepo.deleteById(session_id);

        bookingRepo.deleteBySessionId(session_id);

    }

    @Override
    public ResponseSessionDto findById(String session_id) {
        return toResponseSessionData(sessionRepo.findById(session_id).orElseThrow(() -> new EntryNotFoundException("NO Session")));
    }

    private ResponseSessionDto toResponseSessionData(Session session) {
        if(session == null) return null;
        return ResponseSessionDto.builder()
                .session_id(session.getSessionId())
                .eventId(session.getEventId())
                .slotNumber(session.getSlotNumber())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .sessionType(session.getSessionType())
                .available(session.isAvailable())
                .build();
    }

    @Override
    public void updateSessionById(boolean available, String session_id) {
        Session session = sessionRepo.findById(session_id).orElseThrow(() -> new EntryNotFoundException("Session not found"));
       // TimeSlots timeSlots=timeSlotsRepo.findById(requestSessionDto.getTimeSlot()).orElseThrow(() -> new EntryNotFoundException("Event not found"));
//        session.setStartTime(requestSessionDto.getStartTime());
//        session.setEndTime(requestSessionDto.getEndTime());
//        session.setSessionType(requestSessionDto.getSessionType());
        session.setAvailable(available);
        sessionRepo.save(session);
    }


    @Override
    public PaginateSessionDto searchAll(String searchText, int page, int size) {
        Page<Session> sessionList= sessionRepo.searchAll(searchText, PageRequest.of(page,size));
        return PaginateSessionDto.builder()
                .dataList(
                        sessionList.stream().map(e->toResponseSessionData(e)).toList()
                )
                .count(
                        sessionList.getTotalElements()
                )
                .build();
    }
}
