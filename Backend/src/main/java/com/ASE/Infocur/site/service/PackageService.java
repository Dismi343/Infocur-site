package com.ASE.Infocur.site.service;

import com.ASE.Infocur.site.dto.request.RequestPackageDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginatePackageDto;
import com.ASE.Infocur.site.dto.response.response.ResponsePackageDto;
import com.ASE.Infocur.site.entity.ClientPackage;
import org.springframework.http.ResponseEntity;

public interface PackageService {

    public ResponseEntity<ClientPackage> save(RequestPackageDto dto);
    public void delete(String packageId);
    public ResponsePackageDto findById(String packageId);
    public ResponseEntity<ClientPackage> updateById(RequestPackageDto dto,String packageId);
    public PaginatePackageDto searchAll(String searchText, int page, int size);
}
