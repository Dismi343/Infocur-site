package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.RequestPackageDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginatePackageDto;
import com.ASE.Infocur.site.dto.response.response.ResponseEventDto;
import com.ASE.Infocur.site.dto.response.response.ResponsePackageDto;
import com.ASE.Infocur.site.entity.ClientPackage;
import com.ASE.Infocur.site.exception.EntryNotFoundException;
import com.ASE.Infocur.site.repository.PackageRepo;
import com.ASE.Infocur.site.service.PackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PackageServiceImpl implements PackageService {
    private final PackageRepo packageRepo;
    @Override
    public ResponseEntity<ClientPackage> save(RequestPackageDto dto) {

       ClientPackage savedPackage= packageRepo.save(toPackage(dto));
        return ResponseEntity.ok(savedPackage);
    }

    private ClientPackage toPackage(RequestPackageDto dto) {
        if(dto==null) return null;
        return ClientPackage.builder()
                .packageId(UUID.randomUUID().toString())
                .packageName(dto.getPackageName())
                .photoCount(dto.getPhotoCount())
                .price(dto.getPrice())
                .numberOfMembers(dto.getNumberOfMembers())
                .color(dto.getColor())
                .build();
    }

    @Override
    public void delete(String packageId) {
            packageRepo.deleteById(packageId);
    }

    private ResponsePackageDto toResponsePackageDto(ClientPackage pkg) {
        if(pkg==null) return null;
        return ResponsePackageDto.builder()
                .packageId(pkg.getPackageId())
                .packageName(pkg.getPackageName())
                .photoCount(pkg.getPhotoCount())
                .price(pkg.getPrice())
                .numberOfMembers(pkg.getNumberOfMembers())
                .color(pkg.getColor())
                .build();
    }

    @Override
    public ResponsePackageDto findById(String packageId) {
        return packageRepo.findById(packageId)
                .map(this::toResponsePackageDto)
                .orElseThrow(() -> new EntryNotFoundException("No Package Found"));
    }

    @Override
    public ResponseEntity<ClientPackage> updateById(RequestPackageDto dto,String packageId) {
        ClientPackage pack = packageRepo.findById(packageId).orElseThrow(()->new EntryNotFoundException("No Pakage Found"));
        pack.setPackageName(dto.getPackageName());
        pack.setPhotoCount(dto.getPhotoCount());
        pack.setPrice(dto.getPrice());
        pack.setNumberOfMembers(dto.getNumberOfMembers());
        pack.setColor(dto.getColor());
        ClientPackage savedPackage= packageRepo.save(pack);
        return ResponseEntity.ok(savedPackage);
    }

    @Override
    public PaginatePackageDto searchAll(String searchText, int page, int size) {

        Page<ClientPackage> packageList= packageRepo.searchAll(searchText, PageRequest.of(page, size));
        return PaginatePackageDto.builder()
                .dataList(
                        packageList.stream().map(e->toResponsePackageDto(e)).toList()
                )
                .count(
                        packageList.getTotalElements()
                )
                .build();
    }
}
