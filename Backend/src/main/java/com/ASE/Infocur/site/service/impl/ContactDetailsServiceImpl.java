package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.RequestContactDetailsDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateContactDetialsDto;
import com.ASE.Infocur.site.dto.response.response.ResponseContactDetailsDto;
import com.ASE.Infocur.site.entity.ContactDetails;
import com.ASE.Infocur.site.exception.EntryNotFoundException;
import com.ASE.Infocur.site.repository.ContactDetailsRepo;
import com.ASE.Infocur.site.service.ContactDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactDetailsServiceImpl implements ContactDetailsService {

    private final ContactDetailsRepo contactDetailsRepo;

    @Override
    public void save(RequestContactDetailsDto dto) {
        contactDetailsRepo.save(toContactDetails(dto));
    }

    private ContactDetails toContactDetails(RequestContactDetailsDto dto) {
        if (dto == null) return null;
        return ContactDetails.builder()
                .id(UUID.randomUUID().toString())
                .contact1(dto.getContact1())
                .contact2(dto.getContact2())
                .email(dto.getEmail())
                .build();
    }

    @Override
    public void delete(String id) {
        contactDetailsRepo.deleteById(id);
    }

    @Override
    public ResponseContactDetailsDto findById(String id) {
        return toResponseContactDetailsDto(contactDetailsRepo.findById(id)
                .orElseThrow(() -> new EntryNotFoundException("NO such detail")));
    }

    @Override
    public ResponseContactDetailsDto get(String id) {
        return null;
    }

    @Override
    public void update(RequestContactDetailsDto requestContactDetailsDto, String id) {
        ContactDetails contact = contactDetailsRepo.findById(id)
                .orElseThrow(() -> new EntryNotFoundException("No ContactDetails"));
        contact.setContact1(requestContactDetailsDto.getContact1());
        contact.setContact2(requestContactDetailsDto.getContact2());
        contact.setEmail(requestContactDetailsDto.getEmail());
        contactDetailsRepo.save(contact);
    }

    private ResponseContactDetailsDto toResponseContactDetailsDto(ContactDetails c) {
        if (c == null) return null;
        return ResponseContactDetailsDto.builder()
                .id(c.getId())
                .contact1(c.getContact1())
                .contact2(c.getContact2())
                .email(c.getEmail())
                .build();
    }

    @Override
    public PaginateContactDetialsDto searchAll(String searchText, int page, int size) {
        Page<ContactDetails> contactPage = contactDetailsRepo.searchAll(searchText, PageRequest.of(page, size));
        return PaginateContactDetialsDto.builder()
                .dataList(contactPage.stream().map(e -> toResponseContactDetailsDto(e)).toList())
                .count(contactPage.getTotalElements())
                .build();
    }
}

