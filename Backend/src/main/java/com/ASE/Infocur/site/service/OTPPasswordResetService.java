package com.ASE.Infocur.site.service;

import java.io.IOException;

public interface OTPPasswordResetService {
    public void sendOtp(String email) throws IOException;
    public boolean verifyOTP(String email,String otp);
    public String ResetPassword(String email,String newPassword);

}
