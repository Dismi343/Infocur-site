package com.ASE.Infocur.site.dto.response.response;

import com.ASE.Infocur.site.entity.Booking;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.Event;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponsePhotoProgressDto {
    private String id;
    private Client clientId;
    private Event eventId;
    private Booking bookingId;
    private String status;
    private int img_number;
    private String d_link;
}
