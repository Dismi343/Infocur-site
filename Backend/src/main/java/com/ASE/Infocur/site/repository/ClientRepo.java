package com.ASE.Infocur.site.repository;

import com.ASE.Infocur.site.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepo extends MongoRepository<Client,String> {


     Client findByRegNumber(String regNumber);

    @Query("{fullName:'?0' }")
    Client findByFullName(String fullName);

    @Query(value="{id: '?0'}", fields="{'name': 1, 'quantity': 1}")
    List<Client> findAll(String id);

    @Query("{ 'fullName': { $regex: ?0, $options: 'i' } }")
    Page<Client> searchAll(String searchText, Pageable pageable);

    Optional<Client> findByEmail(String email);

    public long count();
}
