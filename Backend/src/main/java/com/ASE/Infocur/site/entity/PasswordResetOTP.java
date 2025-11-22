package com.ASE.Infocur.site.entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document("Password_Rest_OTP")
@Builder
public class PasswordResetOTP {
    private static final int EXPIRATION = 60 * 24;

    @Id
    private String id;
    private String email;
    private String otp;
    private LocalDateTime expiry;

}
