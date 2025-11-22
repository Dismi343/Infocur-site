package com.ASE.Infocur.site.service;

import com.ASE.Infocur.site.dto.request.RequestContactDetailsDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateContactDetialsDto;
import com.ASE.Infocur.site.dto.response.response.ResponseContactDetailsDto;

public interface ContactDetailsService {
    public void save(RequestContactDetailsDto requestContactDetailsDto);
    public void delete(String id);
    public ResponseContactDetailsDto findById(String id);
    public ResponseContactDetailsDto get(String id);
    public void update(RequestContactDetailsDto requestContactDetailsDto,String id);
    public PaginateContactDetialsDto searchAll(String searchText,int page,int size);
}

