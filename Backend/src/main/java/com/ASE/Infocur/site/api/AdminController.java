package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.AdminRequest;
import com.ASE.Infocur.site.entity.Admin;
import com.ASE.Infocur.site.repository.AdminRepo;
import com.ASE.Infocur.site.service.AdminService;
import com.ASE.Infocur.site.utili.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    @Autowired
    private AdminRepo adminRepo;

    @PostMapping("/create")
    public ResponseEntity<StandardResponse> createAdmin(
            @RequestBody AdminRequest dto
            ){
        Admin admin=adminRepo.findByUsername(dto.getUsername());
        if(admin==null){
            adminService.createAdmin(dto);
            return  new ResponseEntity<>(
                    new StandardResponse(
                        "Admin created",201,null
                    ), HttpStatus.CREATED
                    );
        }
        return new ResponseEntity<>(
                new StandardResponse(
                        "Admin Exist", 409, null
                ), HttpStatus.BAD_REQUEST
        );
    }
}
