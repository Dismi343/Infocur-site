package com.ASE.Infocur.site.entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document("Admin")
@Builder
public class Admin {
    @Id
    @Field("username")
    private String username;

    @Field("password")
    private String password;

    @Field("role")
    private String role;
}
