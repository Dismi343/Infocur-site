package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends MongoRepository<Admin, String> {
    //Admin findByUsername(String username);

    default Admin findByUsername(String username) {
        return findById(username).orElse(null);
    }
}
