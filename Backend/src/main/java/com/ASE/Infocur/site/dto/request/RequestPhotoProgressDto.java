package com.ASE.Infocur.site.dto.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestPhotoProgressDto {
    private String clientId;
    private String eventId;
    private String bookingId;
    private String status;
    private int img_number;
    private String d_link;

}
