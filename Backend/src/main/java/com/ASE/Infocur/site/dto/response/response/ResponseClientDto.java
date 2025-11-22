package com.ASE.Infocur.site.dto.response.response;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseClientDto {
    private String id;
    private String fullName;
    private String faculty;
    private String userType;
    private String regNumber;
    private String email;
    private String mNumber;
    private String password;
}
