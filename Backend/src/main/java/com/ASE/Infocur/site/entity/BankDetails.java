package com.ASE.Infocur.site.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("BankDe")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BankDetails {
    @Id
    private String id;
    @Field("accountNumber")
    private String accountNumber;
    @Field("bankName")
    private String bankName;
    @Field("branch")
    private String branch;
    @Field("accountHolderName")
    private String accountHolderName;

}
