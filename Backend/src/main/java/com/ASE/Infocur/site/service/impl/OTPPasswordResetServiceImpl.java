package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.PasswordResetOTP;
import com.ASE.Infocur.site.repository.ClientRepo;
import com.ASE.Infocur.site.repository.PasswordResetOTPRepo;
import com.ASE.Infocur.site.service.EmailService;
import com.ASE.Infocur.site.service.OTPPasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class OTPPasswordResetServiceImpl implements OTPPasswordResetService {

    private final ClientRepo clientRepository;
    private final PasswordResetOTPRepo passwordResetOTPRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void sendOtp(String email) throws IOException {
        Optional<Client> userOpt = clientRepository.findByEmail(email);
        if (userOpt.isEmpty()) return;

        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        passwordResetOTPRepo.deleteByEmail(email);
        String passwordResetId = UUID.randomUUID().toString();
        passwordResetOTPRepo.save(new PasswordResetOTP(passwordResetId,email, otp, expiry));

        String body = "<p>Your OTP for password reset is <b>" + otp + "</b>. It expires in 5 minutes.</p>";
        emailService.sendEmail(email, "Password Reset OTP", body);
    }

    @Override
    public boolean verifyOTP(String email, String otp) {

        Optional<PasswordResetOTP> otpOpt = passwordResetOTPRepo.findByEmail(email);
        if (otpOpt.isEmpty()) return false;

        PasswordResetOTP record = otpOpt.get();
        if (record.getExpiry().isBefore(LocalDateTime.now())) return false;
        return record.getOtp().equals(otp);
    }

    @Override
    public String ResetPassword(String email, String newPassword) {
        Optional<PasswordResetOTP> otpOpt = passwordResetOTPRepo.findByEmail(email);
        if (otpOpt.isEmpty()) return "OTP not verified";
        Client user = clientRepository.findByEmail(email).orElse(null);
        if (user == null) return "User not found";

        user.setPassword(passwordEncoder.encode(newPassword));
        clientRepository.save(user);

        passwordResetOTPRepo.deleteByEmail(email);
        return "Password reset successfully";
    }
}
