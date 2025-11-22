package com.ASE.Infocur.site.dto.response.response;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseBankDetailsDto {

    private String id;
    private String accountNumber;
    private String bankName;
    private String branch;
    private String accountHolderName;

}
