package com.ASE.Infocur.site.dto.response.response;

import com.ASE.Infocur.site.entity.Event;
import lombok.*;

import java.time.LocalTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseSessionDto {
    private Event eventId;
    private  int slotNumber;
    private String session_id;
    private LocalTime startTime; // Format: HH:MM
    private LocalTime  endTime;
    private String sessionType;
    private boolean available;
}
