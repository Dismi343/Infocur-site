package com.ASE.Infocur.site.service;

import com.ASE.Infocur.site.dto.request.RequestEventDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateEventDto;
import com.ASE.Infocur.site.dto.response.response.ResponseEventDto;
import com.ASE.Infocur.site.entity.Session;

import java.util.List;

public interface EventService {
    public void save(RequestEventDto dto);
    public void delete(String id);
    public ResponseEventDto findById(String id);
    public void updateById(RequestEventDto dto,String id);
    public PaginateEventDto searchAll(String searchText,int page,int size);
    public List<Session> getAvailableSlots(String eventId);
}
