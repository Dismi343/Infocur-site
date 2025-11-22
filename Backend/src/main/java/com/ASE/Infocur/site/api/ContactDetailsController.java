package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.RequestContactDetailsDto;
import com.ASE.Infocur.site.dto.response.response.ResponseContactDetailsDto;
import com.ASE.Infocur.site.service.ContactDetailsService;
import com.ASE.Infocur.site.utili.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contactDetails")
public class ContactDetailsController {
    private final ContactDetailsService contactDetailsService;

    @PostMapping("/create")
    public ResponseEntity<StandardResponse> create(
            @RequestBody RequestContactDetailsDto contactDetails
    ) {
        contactDetailsService.save(contactDetails);
        return new ResponseEntity<>(new StandardResponse(
                "Contact Details saved successfully", 200, null
        ), HttpStatus.CREATED);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<StandardResponse> findById(
            @PathVariable String id
    ) {
        return new ResponseEntity<>(new StandardResponse(
                "Contact Details fetched successfully", 200, contactDetailsService.findById(id)
        ), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updateById(
            @PathVariable String id,
            @RequestBody RequestContactDetailsDto dto
    ) {
        contactDetailsService.update(dto, id);
        return new ResponseEntity<>(new StandardResponse(
                "Contact Details Updated successfully", 200, null
        ), HttpStatus.CREATED);
    }

    public void deleteById() {}
    public void searchAll() {}
}

