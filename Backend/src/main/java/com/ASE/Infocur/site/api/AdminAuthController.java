package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.AdminRequest;
import com.ASE.Infocur.site.entity.Admin;
import com.ASE.Infocur.site.repository.AdminRepo;
import com.ASE.Infocur.site.utili.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth/admin")
public class AdminAuthController {

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<StandardResponse> login(
            @RequestBody AdminRequest adminRequest,
            HttpServletRequest httpServletRequest
            ){
        Admin admin = adminRepo.findByUsername(adminRequest.getUsername());

        if(admin == null || !passwordEncoder.matches(adminRequest.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new StandardResponse("invalid", 401, null));
        }

        HttpSession session = httpServletRequest.getSession(true);
        session.setAttribute("ADMIN", admin);


        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(admin.getUsername(),null,
                        List.of(new SimpleGrantedAuthority(admin.getRole())));

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        return ResponseEntity.ok(new StandardResponse("succeed", 200, admin));

    }

    @PostMapping("/logout")
    public ResponseEntity<StandardResponse> logout(HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession(false);
        if(session != null) session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new StandardResponse("succeed", 200, "Admin logged out"));
    }

}
