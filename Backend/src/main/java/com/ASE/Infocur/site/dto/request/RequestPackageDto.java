package com.ASE.Infocur.site.dto.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestPackageDto {
    private String packageName;
    private int photoCount;
    private double price;
    private int numberOfMembers;
    private String color;
}
