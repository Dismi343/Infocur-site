package com.ASE.Infocur.site.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Packages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClientPackage {

    @Id
    private String packageId;
    private String packageName;
    private int photoCount;
    private double price;
    private int numberOfMembers;
    private String color;

}
