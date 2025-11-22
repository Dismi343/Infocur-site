package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.RequestBankDetailsDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateBankDetialsDto;
import com.ASE.Infocur.site.dto.response.response.ResponseBankDetailsDto;
import com.ASE.Infocur.site.entity.BankDetails;
import com.ASE.Infocur.site.exception.EntryNotFoundException;
import com.ASE.Infocur.site.repository.BankDetailsRepo;
import com.ASE.Infocur.site.service.BankDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BankDetailsServiceImpl implements BankDetailsService {

    private final BankDetailsRepo bankDetailsRepo;

    @Override
    public void save(RequestBankDetailsDto dto) {
        bankDetailsRepo.save(toBankDetails(dto));
    }

    private BankDetails toBankDetails(RequestBankDetailsDto dto) {
        if(dto==null) return null;
        return BankDetails.builder()
                .id(UUID.randomUUID().toString())
                .accountNumber(dto.getAccountNumber())
                .bankName(dto.getBankName())
                .branch(dto.getBranch())
                .accountHolderName(dto.getAccountHolderName())
                .build();
    }


    @Override
    public void delete(String id) {
        bankDetailsRepo.deleteById(id);
    }

    @Override
    public ResponseBankDetailsDto findById(String id) {
        return toResponseBankDetailsDto(bankDetailsRepo.findById(id).orElseThrow(()->new EntryNotFoundException("NO such detail")));
    }

    @Override
    public ResponseBankDetailsDto get(String accountNumber) {

        return null;
    }

    @Override
    public void update(RequestBankDetailsDto requestBankDetailsDto,String id) {
            BankDetails bank=bankDetailsRepo.findById(id).orElseThrow(()->new EntryNotFoundException("No BankDetails"));
            bank.setAccountNumber(requestBankDetailsDto.getAccountNumber());
            bank.setBankName(requestBankDetailsDto.getBankName());
            bank.setBranch(requestBankDetailsDto.getBranch());
            bank.setAccountHolderName(requestBankDetailsDto.getAccountHolderName());
            bankDetailsRepo.save(bank);
    }

    private ResponseBankDetailsDto toResponseBankDetailsDto(BankDetails bank) {
        if(bank==null) return null;
        return ResponseBankDetailsDto.builder()
                .id(bank.getId())
                .accountNumber(bank.getAccountNumber())
                .bankName(bank.getBankName())
                .branch(bank.getBranch())
                .accountHolderName(bank.getAccountHolderName())
                .build();
    }

    @Override
    public PaginateBankDetialsDto searchAll(String searchText, int page, int size) {
        Page<BankDetails> bankDetailsList=bankDetailsRepo.searchAll(searchText, PageRequest.of(page,size));
        return  PaginateBankDetialsDto.builder()
                .dataList(
                        bankDetailsList.stream().map(e->toResponseBankDetailsDto(e)).toList()
                )
                .count(
                        bankDetailsList.getTotalElements()
                )
                .build();

    }


}
