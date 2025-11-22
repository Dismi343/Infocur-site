package com.ASE.Infocur.site.dto.request;

import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.Session;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestBookingDto {
    private String clientId;
    private String sessionId;
    private String packageId;
   // private LocalDate date;
    private String status;
    private String slipFile;
    private String slipUrl;
}
