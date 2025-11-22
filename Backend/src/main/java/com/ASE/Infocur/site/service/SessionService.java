package com.ASE.Infocur.site.service;


import com.ASE.Infocur.site.dto.request.RequestSessionDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateSessionDto;
import com.ASE.Infocur.site.dto.response.response.ResponseClientDto;
import com.ASE.Infocur.site.dto.response.response.ResponseSessionDto;

public interface SessionService  {
    public void save(RequestSessionDto dto);
    public void delete(String session_id);
    public ResponseSessionDto findById(String session_id);
    public void updateSessionById(boolean available,String session_id);
    public PaginateSessionDto searchAll(String searchText,int page,int pageSize);
}
