package com.ASE.Infocur.site.dto.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestBankDetailsDto {

    private String accountNumber;
    private String bankName;
    private String branch;
    private String accountHolderName;
}
