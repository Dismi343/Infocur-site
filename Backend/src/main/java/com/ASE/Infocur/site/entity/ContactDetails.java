package com.ASE.Infocur.site.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("ContactDe")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactDetails {
    @Id
    private String id;

    @Field("contact1")
    private String contact1;

    @Field("contact2")
    private String contact2;

    @Field("email")
    private String email;
}

