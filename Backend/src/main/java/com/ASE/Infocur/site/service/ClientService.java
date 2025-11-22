package com.ASE.Infocur.site.service;

import com.ASE.Infocur.site.dto.request.RequestClientDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateClientDto;
import com.ASE.Infocur.site.dto.response.response.ResponseClientDto;

public interface ClientService {
    public void save(RequestClientDto dto);
    public void delete(String id);
    public ResponseClientDto findById(String id);
    public void updateById(RequestClientDto dto,String id);
    public PaginateClientDto searchAll(String searchText, int page, int size);
    public void passwordUpdate(String regNumber,String currentPassword,String newPassword);

}
