package com.ASE.Infocur.site.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Document("Event")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event {
    @Id
    private String eventId;

    @DBRef
    private List<ClientPackage> indoorPackageInfo;

    @DBRef
    private List<ClientPackage> outdoorPackageInfo;

    private String eventName;

    private Indoor indoor;
    private Outdoor outdoor;

    private LocalTime startTime;
    private LocalDate date;

    public boolean isIndoor() {
        return indoor != null;
    }

    public boolean isOutdoor() {
        return outdoor != null;
    }
}
