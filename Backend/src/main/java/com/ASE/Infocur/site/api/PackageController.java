package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.RequestPackageDto;
import com.ASE.Infocur.site.entity.ClientPackage;
import com.ASE.Infocur.site.service.PackageService;
import com.ASE.Infocur.site.utili.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/packages")
public class PackageController {
    private final PackageService packageService;

    @PostMapping("/create")
    public ResponseEntity<ClientPackage> create(
            @RequestBody RequestPackageDto dto
            ) {
            return packageService.save(dto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<StandardResponse> delete(
            @PathVariable String id
    ) {
        packageService.delete(id);
        return new ResponseEntity<>(
                new StandardResponse(
                        "Package Deleted", 201, null
                ),HttpStatus.NO_CONTENT
        );
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<StandardResponse> findById(
            @PathVariable String id
    ) {
        return new ResponseEntity<>(
                new StandardResponse(
                        "Package Found", 200, packageService.findById(id)
                ), HttpStatus.OK
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ClientPackage> updateById(
            @RequestBody RequestPackageDto dto,
            @PathVariable String id
    ) {
        return packageService.updateById(dto,id);
    }

    @GetMapping("/search-all")
    public ResponseEntity<StandardResponse> searchAll(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return new ResponseEntity<>(
                new StandardResponse(
                        "Package List ",200,packageService.searchAll(searchText, page, size)
                ), HttpStatus.CREATED
        );
    }
}
