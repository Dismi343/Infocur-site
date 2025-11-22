package com.ASE.Infocur.site.service;

import com.ASE.Infocur.site.dto.request.RequestBookingDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateBookingDto;
import com.ASE.Infocur.site.dto.response.response.ResponseBookingDto;
import com.ASE.Infocur.site.entity.Booking;
import com.ASE.Infocur.site.entity.Client;

public interface BookingService {
    public void save(RequestBookingDto requestBookingDto);
    public void delete(String id);
    public ResponseBookingDto finById(String id);
    public void updateById(RequestBookingDto requestBookingDto,String id);
    public PaginateBookingDto searchAll(String searchText, int page,int size);
    public PaginateBookingDto searchAllByClient(String searchText, int page, int size, String clientId);
    public PaginateBookingDto searchAllByEvent(String searchText, int page, int size, String eventId);
    public void updateStatus(String id, String status);

}
