package com.ASE.Infocur.site.service;

import com.ASE.Infocur.site.dto.request.RequestBankDetailsDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateBankDetialsDto;
import com.ASE.Infocur.site.dto.response.response.ResponseBankDetailsDto;

public interface BankDetailsService {
    public void save(RequestBankDetailsDto requestBankDetailsDto);
    public void delete(String id);
    public ResponseBankDetailsDto findById(String id);
    public ResponseBankDetailsDto get(String id);
    public void update(RequestBankDetailsDto requestBankDetailsDto,String id);
    public PaginateBankDetialsDto searchAll(String searchText,int page,int size);

}
