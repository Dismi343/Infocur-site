package com.ASE.Infocur.site.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("PhotoProgress")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhotoProgress {

    @Id
    private String id;

    @DBRef
    private Client client;

    @DBRef
    private Event event;

    @DBRef
    private Booking booking;

    private int img_number;
    private String d_link;
    private String status;
}
