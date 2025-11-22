package com.ASE.Infocur.site.api;


import com.ASE.Infocur.site.dto.request.RequestBankDetailsDto;
import com.ASE.Infocur.site.entity.BankDetails;
import com.ASE.Infocur.site.service.BankDetailsService;
import com.ASE.Infocur.site.utili.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bankDetails")
public class BankDetailsController {
        private final BankDetailsService bankDetailsService;

        @PostMapping("/create")
        public ResponseEntity<StandardResponse> create(
                @RequestBody RequestBankDetailsDto bankDetails
        ){
            bankDetailsService.save(bankDetails);
            return new ResponseEntity<>(new StandardResponse(
                    "Bank Details saved successfully",200,null
            ), HttpStatus.CREATED);
        }

    //---------------------------
        @GetMapping("/find/{id}")
        public ResponseEntity<StandardResponse> findById(
                @PathVariable String id
        ){

            return new ResponseEntity<>(new StandardResponse(
                    "Bank Details Updated successfully",200,bankDetailsService.findById(id)
            ), HttpStatus.OK);
        }

    //----------------------------

        @PutMapping("/update/{id}")
        public ResponseEntity<StandardResponse> updateById(
                @PathVariable String id,
                @RequestBody RequestBankDetailsDto dto

        ){
            bankDetailsService.update(dto,id);
            return new ResponseEntity<>(new StandardResponse(
                    "Bank Details Updated successfully",200,null
            ), HttpStatus.CREATED);
        }
        
        public void deleteById(){}
        public void searchAll(){}
}
