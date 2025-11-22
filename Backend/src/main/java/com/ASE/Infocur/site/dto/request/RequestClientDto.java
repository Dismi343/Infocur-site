package com.ASE.Infocur.site.dto.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestClientDto {
    private String fullName;
    private String faculty;
    private String userType;
    private String regNumber;
    private String email;
    private String mNumber;
    private String password;
}
