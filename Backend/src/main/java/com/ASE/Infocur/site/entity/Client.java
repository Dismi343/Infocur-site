package com.ASE.Infocur.site.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Client")
@Builder
@Getter
@Setter
@NoArgsConstructor

public class Client {
    @Id
    private String id;
    private String fullName;
    private String faculty;
    private String userType;
    private String regNumber;
    private String email;
    private String mNumber;
    private String password;

    public Client(String id, String fullName, String faculty, String userType, String regNumber, String email, String mNumber, String password) {
        super();
        this.id = id;
        this.fullName = fullName;
        this.faculty = faculty;
        this.userType = userType;
        this.regNumber = regNumber;
        this.email = email;
        this.mNumber = mNumber;
        this.password=password;
    }
}
