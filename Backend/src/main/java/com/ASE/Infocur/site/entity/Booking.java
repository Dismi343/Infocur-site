package com.ASE.Infocur.site.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document("Booking")
@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    private String bookingId;

    @DBRef
    private Client client;

    @DBRef
    private Session session;

    @DBRef
    private ClientPackage clientPackageInfo;

    private LocalDate date;
    private String status;
    private String slipFile;
    private String slipUrl;

}
