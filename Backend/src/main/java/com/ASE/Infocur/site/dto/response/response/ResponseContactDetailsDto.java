package com.ASE.Infocur.site.dto.response.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseContactDetailsDto {
    private String id;
    private String contact1;
    private String contact2;
    private String email;
}

