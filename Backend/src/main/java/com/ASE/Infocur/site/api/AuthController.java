package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.LoginRequest;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.repository.ClientRepo;
import com.ASE.Infocur.site.service.OTPPasswordResetService;
import com.ASE.Infocur.site.utili.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/auth/clients")
public class AuthController {

    @Autowired
    private ClientRepo clientRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private  OTPPasswordResetService otpPasswordResetService;

    @PostMapping("/login")
    public ResponseEntity<StandardResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpServletRequest) {
        Client client = clientRepo.findByRegNumber(request.getRegNumber());
        if(client == null || !passwordEncoder.matches(request.getPassword(), client.getPassword())){
            return new ResponseEntity<>(
                    new StandardResponse(
                            "invalid",401,null
                    ), HttpStatus.UNAUTHORIZED
            );
        }

        HttpSession session = httpServletRequest.getSession(true);
        session.setAttribute("CLIENT", client);

        UsernamePasswordAuthenticationToken authentication= new UsernamePasswordAuthenticationToken(client.getRegNumber(),null,null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        System.out.println("Session created with ID: " + session.getId());
        session.setAttribute("CLIENT", client);
        return new ResponseEntity<>(
                new StandardResponse(
                        "succeed",200,client
                ), HttpStatus.OK
        );


    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.status(200).body("Logged out successfully");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOTP(@RequestBody Map<String, String> request) throws IOException {
        String email = request.get("email");
        otpPasswordResetService.sendOtp(email);
        return ResponseEntity.ok(Map.of("message", "If the email exists, OTP sent."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        boolean verified = otpPasswordResetService.verifyOTP(email, otp);
        if (verified) {
            return ResponseEntity.ok(Map.of("verified", true, "message", "OTP verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("verified", false, "message", "Invalid or expired OTP"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        String result = otpPasswordResetService.ResetPassword(email, password);
        if (result.equals("Password reset successfully"))
            return ResponseEntity.ok(Map.of("message", result));

        return ResponseEntity.badRequest().body(Map.of("message", result));
    }
}
