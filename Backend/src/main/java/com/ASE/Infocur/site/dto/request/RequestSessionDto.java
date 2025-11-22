package com.ASE.Infocur.site.dto.request;

import com.ASE.Infocur.site.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class RequestSessionDto {
    private String eventId;
    private  int slotNumber;
    private LocalTime startTime; // Format: HH:MM
    private LocalTime  endTime;
    private String sessionType;
    private boolean available;
}
