package com.ASE.Infocur.site.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;

@Document("Session")
@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    @Id
    private String sessionId;
    @DBRef
    private Event eventId;
    private  int slotNumber;
    private LocalTime startTime; // Format: HH:MM
    private LocalTime  endTime;
    private String sessionType;
    private boolean available;

    public Session(String sessionId,Event eventId,int slotNumber,LocalTime startTime,LocalTime endTime,String sessionType,boolean available,int slotCount) {
       if(slotNumber<1||slotNumber>slotCount) {
           throw new IllegalArgumentException("Slot number must be between 1 and " + slotCount);
       }
        this.sessionId = sessionId;
        this.eventId = eventId;
        this.slotNumber = slotNumber;
        this.startTime=startTime;
        this.endTime=endTime;
        this.sessionType = sessionType;
        this.available = available;
    }
}
