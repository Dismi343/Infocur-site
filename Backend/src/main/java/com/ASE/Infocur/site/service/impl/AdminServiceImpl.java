package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.AdminRequest;
import com.ASE.Infocur.site.entity.Admin;
import com.ASE.Infocur.site.repository.AdminRepo;
import com.ASE.Infocur.site.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminRepo adminRepo;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void createAdmin(AdminRequest dto) {

        adminRepo.save(toAdmin(dto));
    }

    private Admin toAdmin(AdminRequest dto){
        String rawPassword = dto.getPassword();
        String hashedPassword = passwordEncoder.encode(rawPassword);
        return Admin.builder()
                .username(dto.getUsername())
                .password(hashedPassword)
                .role("ROLE_ADMIN")
                .build();
    }

}
