package com.ASE.Infocur.site.dto.request;

import com.ASE.Infocur.site.entity.Indoor;
import com.ASE.Infocur.site.entity.Outdoor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestEventDto {
    private List<String> indoorPackageInfo;
    private List<String> outdoorPackageInfo;

    private String eventName;

    private Indoor indoor;
    private Outdoor outdoor;

    private LocalTime startTime;
    private LocalDate date;


}
