package com.ASE.Infocur.site.dto.response.response;

import com.ASE.Infocur.site.entity.Indoor;
import com.ASE.Infocur.site.entity.Outdoor;
import com.ASE.Infocur.site.entity.ClientPackage;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseEventDto {
    private String eventId;
    private List<ClientPackage> indoorPackageInfo;
    private List<ClientPackage> outdoorPackageInfo;

    private String eventName;

    private Indoor indoor;
    private Outdoor outdoor;

    private LocalTime startTime;
    private LocalDate date;
}
