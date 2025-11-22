package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.RequestClientDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateClientDto;
import com.ASE.Infocur.site.dto.response.response.ResponseClientDto;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.exception.EntryNotFoundException;
import com.ASE.Infocur.site.repository.ClientRepo;
import com.ASE.Infocur.site.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepo clientRepo;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void save(RequestClientDto dto) {
        String rawPassword = dto.getPassword();
        String hashedPassword = passwordEncoder.encode(rawPassword);
        dto.setPassword(hashedPassword);

        clientRepo.save(toClient(dto));
    }

    private Client toClient(RequestClientDto dto) {
        if(dto==null) return null;
        System.out.println(dto.getPassword());
        System.out.println(dto.getMNumber());
        return Client.builder()
                .id(UUID.randomUUID().toString())
                .fullName(dto.getFullName())
                .faculty(dto.getFaculty())
                .userType(dto.getUserType())
                .regNumber(dto.getRegNumber())
                .email(dto.getEmail())
                .mNumber(dto.getMNumber())
                .password(dto.getPassword())
                .build();
    }

    @Override
    public void delete(String id) {
        clientRepo.deleteById(id);
    }

    @Override
    public ResponseClientDto findById(String id) {
        return toResponseClient(clientRepo.findById(id).orElseThrow(()->new EntryNotFoundException("no client")));
    }

    private ResponseClientDto toResponseClient(Client client) {
        if(client==null) return null;
        return ResponseClientDto.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .faculty(client.getFaculty())
                .userType(client.getUserType())
                .regNumber(client.getRegNumber())
                .email(client.getEmail())
                .mNumber(client.getMNumber())
                .password(client.getPassword())
                .build();

    }

    @Override
    public void updateById(RequestClientDto dto, String id) {
        Client client =clientRepo.findById(id).orElseThrow(()->new EntryNotFoundException("no client"));

        client.setFullName(dto.getFullName());
        client.setFaculty(dto.getFaculty());
        client.setUserType(dto.getUserType());
        client.setRegNumber(dto.getRegNumber());
        client.setEmail(dto.getEmail());
        client.setMNumber(dto.getMNumber());
        clientRepo.save(client);
    }

    @Override
    public PaginateClientDto searchAll(String searchText, int page, int size) {
        Page<Client> clientList=clientRepo.searchAll(searchText, PageRequest.of(page,size));

        return new PaginateClientDto().builder()
                .dataList(
                        clientList.stream().map(e->toResponseClient(e)).toList()
                )
                .count(
                        clientList.getTotalElements()
                )
                .build();


    }

    @Override
    public void passwordUpdate(String regNumber, String currentPassword, String newPassword) {

        Client client=clientRepo.findByRegNumber(regNumber);
        if(client==null) throw new EntryNotFoundException("no client");
        if(!passwordEncoder.matches(currentPassword,client.getPassword())){
            throw new IllegalArgumentException("Current password is incorrect");
        }

        String rawPassword = newPassword;
        String hashedPassword = passwordEncoder.encode(rawPassword);
        client.setPassword(hashedPassword);
        clientRepo.save(client);



    }
}
