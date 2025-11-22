package com.ASE.Infocur.site.dto.response.response;

import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.ClientPackage;
import com.ASE.Infocur.site.entity.Session;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseBookingDto {
    private String bookingId;
    private Client clientId;
    private Session sessionId;
    private ClientPackage packageId;
    private LocalDate date;
    private String status;
    private String slipFile;
    private String slipUrl;
}
