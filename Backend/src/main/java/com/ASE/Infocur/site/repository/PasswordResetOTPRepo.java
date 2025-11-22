package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.PasswordResetOTP;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PasswordResetOTPRepo extends MongoRepository<PasswordResetOTP,String> {
    Optional<PasswordResetOTP> findByEmail(String email);
    void deleteByEmail(String email);
}
