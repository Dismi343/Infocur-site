package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.ClientPackage;
import com.ASE.Infocur.site.entity.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageRepo extends MongoRepository<ClientPackage, String> {



    @Query("{ 'packageName': { $regex: ?0, $options: 'i' } }")
    Page<ClientPackage> searchAll(String searchText, Pageable pageable);



    public long count();

}
