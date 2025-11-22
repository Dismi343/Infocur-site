package com.ASE.Infocur.site.dto.response.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponsePackageDto {
    private String packageId;
    private String packageName;
    private int photoCount;
    private double price;
    private int numberOfMembers;
    private String color;
}
