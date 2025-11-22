package com.ASE.Infocur.site.dto.request;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestContactDetailsDto {
    private String contact1;
    private String contact2;
    private String email;
}

